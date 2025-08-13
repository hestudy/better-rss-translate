import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { RPCHandler } from "@orpc/server/fetch";
import "dotenv/config";
import { Feed } from "feed";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";

const app = new Hono();

const serverAdapter = new HonoAdapter(serveStatic);
createBullBoard({
  queues: [
    new BullMQAdapter(rssQueue),
    new BullMQAdapter(scrapyQueue),
    new BullMQAdapter(translateQueue),
  ],
  serverAdapter,
});
const basePath = "/ui";
serverAdapter.setBasePath(basePath);
app.route(basePath, serverAdapter.registerPlugin());

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const handler = new RPCHandler(appRouter);
app.use("/rpc/*", async (c, next) => {
  const context = await createContext({ context: c });
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }
  await next();
});

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/rss/:id", async (c) => {
  const { id } = c.req.param();
  const record = await db.query.feed.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      items: true,
    },
  });

  if (!record) {
    return c.text("Not Found", 404);
  }

  const feed = new Feed({
    title: record.title || "",
    description: record.description || "",
    id: record.id,
    link: record.link || "",
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    updated: record.lastUpdate || new Date(),
  });

  record.items.forEach((item) => {
    feed.addItem({
      title: item.translateTitle || item.title || "",
      description:
        item.translateContentSnippet || item.translateContentSnippet || "",
      content:
        item.translateContent || item.scrapyContent || item.content || "",
      id: item.id,
      link: item.link || "",
      date: new Date(item.pubDate!),
    });
  });

  return c.text(feed.rss2());
});

import { serve } from "@hono/node-server";
import { db } from "./db";
import { rssQueue } from "./queue/rssQueue";
import { scrapyQueue } from "./queue/scrapyQueue";
import { translateQueue } from "./queue/translateQueue";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
