import { relations } from "drizzle-orm";
import { user } from "./auth";
import { feed, feeditem } from "./feed";

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

export const feedRelations = relations(feed, ({ many, one }) => {
  return {
    items: many(feeditem),
    user: one(user, {
      fields: [feed.userId],
      references: [user.id],
    }),
  };
});
