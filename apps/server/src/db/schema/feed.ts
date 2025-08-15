import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const feed = sqliteTable("feed", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  feedUrl: text("feed_url").notNull(),
  title: text("title"),
  description: text("description"),
  link: text("link"),
  name: text("name"), // RSS 源的显示名称
  cron: text("cron"),
  createDate: integer("create_date", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  shouldScrapy: integer("should_scrapy", { mode: "boolean" }),
  shouldTranslate: integer("should_translate", { mode: "boolean" }),
  translateLanguage: text("translate_language"),
  lastUpdate: integer("last_update", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  status: text("status", {
    enum: ["active", "paused", "error"],
  }).default("active"), // RSS 源状态
  lastFetchAt: integer("last_fetch_at", { mode: "timestamp" }), // 最后获取时间
  fetchInterval: integer("fetch_interval").default(60), // 获取间隔（分钟）
  jobId: text("job_id"),
  jobStatus: text("job_status", {
    enum: ["active", "waiting", "completed", "failed"],
  }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const feeditem = sqliteTable("feeditem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  feedId: text("feed_id")
    .notNull()
    .references(() => feed.id, {
      onDelete: "cascade",
    }),
  title: text("title"),
  contentSnippet: text("contentSnippet"),
  link: text("link"),
  pubDate: text("pub_date"),
  isoDate: text("pub_date"),
  guid: text("guid"),
  content: text("content"),
  scrapyContent: text("scrapy_content"),
  scrapyJobId: text("scrapy_job_id"),
  scrapyJobStatus: text("scrapy_job_status", {
    enum: ["active", "waiting", "completed", "failed"],
  }),
  translateTitle: text("translate_title"),
  translateContentSnippet: text("translate_contentSnippet"),
  translateContent: text("translate_content"),
  translateJobId: text("translate_job_id"),
  translateJobStatus: text("translate_job_status", {
    enum: ["active", "waiting", "completed", "failed"],
  }),
  categories: text("categories", { mode: "json" }).$type<string[]>(),
  createDate: integer("create_date", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  lastUpdate: integer("last_update", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});
