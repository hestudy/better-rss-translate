import { relations } from "drizzle-orm";
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
  cron: text("cron"),
  createDate: integer("create_date", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  lastUpdate: integer("last_update", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
  jobId: text("job_id"),
  jobStatus: text("job_status", {
    enum: ["active", "waiting", "completed", "failed"],
  }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const feedRelations = relations(feed, ({ many, one }) => {
  return {
    items: many(feeditem),
    user: one(user, {
      fields: [feed.userId],
      references: [user.id],
    }),
  };
});

export const feeditem = sqliteTable("feeditem", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  feedId: text("feed_id")
    .notNull()
    .references(() => feed.id),
  title: text("title"),
  contentSnippet: text("contentSnippet"),
  link: text("link"),
  pubDate: text("pub_date"),
  isoDate: text("pub_date"),
  guid: text("guid"),
  content: text("content"),
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

export const feeditemRelations = relations(feeditem, ({ one }) => {
  return {
    feed: one(feed, {
      fields: [feeditem.feedId],
      references: [feed.id],
    }),
    user: one(user, {
      fields: [feeditem.userId],
      references: [user.id],
    }),
  };
});
