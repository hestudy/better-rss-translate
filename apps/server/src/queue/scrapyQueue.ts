import { db } from "@/db";
import { feeditem } from "@/db/schema/feed";
import { Readability } from "@mozilla/readability";
import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { JSDOM } from "jsdom";

export const scrapyQueue = new Queue<{
  feedId: string;
  feeditemId: string;
  feeditemUrl: string;
}>("scrapyqueue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

const scrapyWorker = new Worker<{
  feedId: string;
  feeditemId: string;
  feeditemUrl: string;
}>(
  "scrapyqueue",
  async (job) => {
    const dom = await JSDOM.fromURL(job.data.feeditemUrl);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    await db
      .update(feeditem)
      .set({ scrapyContent: article?.content })
      .where(eq(feeditem.id, job.data.feeditemId));
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

scrapyQueue.on("waiting", async (job) => {
  console.log(`Job ${job.id} is waiting!`);
  await db
    .update(feeditem)
    .set({ scrapyJobStatus: "waiting" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

scrapyWorker.on("active", async (job) => {
  console.log(`Job ${job.id} is active!`);
  await db
    .update(feeditem)
    .set({ scrapyJobStatus: "active" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

scrapyWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed!`);
  await db
    .update(feeditem)
    .set({ scrapyJobStatus: "completed" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

scrapyWorker.on("failed", async (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
  if (job?.data.feeditemId) {
    await db
      .update(feeditem)
      .set({ scrapyJobStatus: "failed" })
      .where(eq(feeditem.id, job.data.feeditemId));
  }
});
