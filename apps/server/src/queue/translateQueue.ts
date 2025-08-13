import { db } from "@/db";
import { feeditem } from "@/db/schema/feed";
import { openaiClient } from "@/lib/openaiClient";
import { Lang, parse, SgNode, type Edit } from "@ast-grep/napi";
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

// 检查节点是否在 code 或 pre 标签内
const isInCodeBlock = (node: SgNode): boolean => {
  // 检查节点是否在特定标签内
  const codeParent = node.inside({
    rule: {
      kind: "element",
      has: {
        kind: "start_tag",
        has: {
          kind: "tag_name",
          regex: "^(code|pre|script|style)$",
        },
      },
    },
  });

  return !!codeParent;
};

// 检查文本是否应该被翻译
const shouldTranslateText = (node: SgNode): boolean => {
  const text = node.text().trim();

  // 跳过空文本或只有空白字符的文本
  if (text.length <= 2) return false;

  // 跳过纯数字或特殊字符
  if (/^[\d\s\-_.,;:!?()[\]{}]+$/.test(text)) return false;

  // 检查是否在代码块内
  if (isInCodeBlock(node)) return false;

  return true;
};

export const parseHtml = async (
  html: string,
  handle: (node: SgNode) => Promise<Edit | undefined>
) => {
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
      return handle(node);
    })
  );
  const newHtml = root.commitEdits(results.filter((d) => !!d));
  return newHtml;
};

export const translateHtml = async (html: string, targetLanguage: string) => {
  return parseHtml(html, async (node) => {
    if (shouldTranslateText(node)) {
      const text = node.text();
      const res = await translateText(text, targetLanguage);
      if (!!res) {
        return node.replace(res);
      }
    }
  });
};
