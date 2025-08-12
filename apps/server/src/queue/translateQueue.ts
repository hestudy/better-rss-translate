import { db } from "@/db";
import { feeditem } from "@/db/schema/feed";
import { openaiClient } from "@/lib/openaiClient";
import { Lang, parse } from "@ast-grep/napi";
import { Queue, Worker } from "bullmq";
import { eq } from "drizzle-orm";

export const translateQueue = new Queue<{
  feeditemId: string;
}>("translatequeue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

export const translateText = async (text: string, targetLanguage: string) => {
  console.log("translating...: ", text);
  const res = await openaiClient.chat.completions.create({
    model: process.env.TRANSLATE_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a translator.only output the translated text.",
      },
      {
        role: "user",
        content: `Translate the following text to ${targetLanguage}: ${text}`,
      },
    ],
  });
  console.log("translated: ", res.choices.at(0)?.message.content);
  return res.choices.at(0)?.message.content;
};

export const translateHtml = async (html: string, targetLanguage: string) => {
  const ast = parse(Lang.Html, html);
  const root = ast.root();
  const nodes = root.findAll({
    rule: {
      kind: "text",
      pattern: "$TEXT",
    },
  });
  const results = await Promise.all(
    nodes.map(async (node) => {
      const text = node.text();
      if (text.length > 2) {
        const res = await translateText(text, targetLanguage);
        if (!!res) {
          return node.replace(res);
        }
      }
    })
  );
  const newHtml = root.commitEdits(results.filter((d) => !!d));
  return newHtml;
};

const translateWorker = new Worker<{
  feeditemId: string;
}>(
  "translatequeue",
  async (job) => {
    const record = await db.query.feeditem.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, job.data.feeditemId);
      },
      with: {
        feed: true,
      },
    });

    if (record?.title) {
      const res = await translateText(
        record.title,
        record.feed.translateLanguage || "chinese simplified"
      );
      await db
        .update(feeditem)
        .set({ translateTitle: res })
        .where(eq(feeditem.id, job.data.feeditemId));
    }

    if (record?.contentSnippet) {
      const res = await translateText(
        record.contentSnippet,
        record.feed.translateLanguage || "chinese simplified"
      );
      await db
        .update(feeditem)
        .set({ translateContentSnippet: res })
        .where(eq(feeditem.id, job.data.feeditemId));
    }

    if (record?.content && !record.scrapyContent) {
      const res = await translateText(
        record.content,
        record.feed.translateLanguage || "chinese simplified"
      );
      await db
        .update(feeditem)
        .set({ translateContent: res })
        .where(eq(feeditem.id, job.data.feeditemId));
    }

    if (record?.scrapyContent) {
      const newHtml = await translateHtml(
        record.scrapyContent,
        record.feed.translateLanguage || "chinese simplified"
      );
      await db
        .update(feeditem)
        .set({ translateContent: newHtml })
        .where(eq(feeditem.id, job.data.feeditemId));
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);

translateQueue.on("waiting", async (job) => {
  console.log(`Job ${job.id} is waiting!`);
  await db
    .update(feeditem)
    .set({ translateJobStatus: "waiting" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

translateWorker.on("active", async (job) => {
  console.log(`Job ${job.id} is active!`);
  await db
    .update(feeditem)
    .set({ translateJobStatus: "active" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

translateWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed!`);
  await db
    .update(feeditem)
    .set({ translateJobStatus: "completed" })
    .where(eq(feeditem.id, job.data.feeditemId));
});

translateWorker.on("failed", async (job, err) => {
  console.log(`Job ${job?.id} failed with ${err.message}`);
  if (job?.data.feeditemId) {
    await db
      .update(feeditem)
      .set({ translateJobStatus: "failed" })
      .where(eq(feeditem.id, job.data.feeditemId));
  }
});
