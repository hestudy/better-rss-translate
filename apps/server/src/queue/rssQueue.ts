import { db } from "@/db";
import { feed, feeditem } from "@/db/schema/feed";
import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import Parser from "rss-parser";

const parser = new Parser();

export const rssQueue = new Queue("rssqueue", {
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

rssWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

rssWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
});
