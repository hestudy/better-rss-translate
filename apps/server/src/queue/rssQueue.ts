import { db } from "@/db";
import { feed, feeditem } from "@/db/schema/feed";
import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import Parser from "rss-parser";

const parser = new Parser();

export const rssQueue = new Queue<{
  feedId: string;
  feedUrl: string;
  userId: string;
}>("rssqueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

const rssWorker = new Worker<{
  feedId: string;
  feedUrl: string;
  userId: string;
}>(
  "rssqueue",
  async (job) => {
    const rss = await parser.parseURL(job.data.feedUrl);
    const { items, ...props } = rss;
    await db.update(feed).set(props).where(eq(feed.id, job.data.feedId));

    for (const item of items) {
      await db.insert(feeditem).values({
        feedId: job.data.feedId,
        userId: job.data.userId,
        ...item,
      });
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

rssQueue.on("waiting", async (job) => {
  console.log(`Job ${job.id} is waiting!`);
  await db
    .update(feed)
    .set({ jobStatus: "waiting" })
    .where(eq(feed.id, job.data.feedId));
});

rssWorker.on("active", async (job) => {
  console.log(`Job ${job.id} is active!`);
  await db
    .update(feed)
    .set({ jobStatus: "active" })
    .where(eq(feed.id, job.data.feedId));
});

rssWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed!`);
  await db
    .update(feed)
    .set({ jobStatus: "completed" })
    .where(eq(feed.id, job.data.feedId));
});

rssWorker.on("failed", async (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
  if (job?.data.feedId) {
    await db
      .update(feed)
      .set({ jobStatus: "failed" })
      .where(eq(feed.id, job.data.feedId));
  }
});
