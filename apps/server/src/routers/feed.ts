import { db } from "@/db";
import { feed } from "@/db/schema/feed";
import { protectedProcedure } from "@/lib/orpc";
import { rssQueue } from "@/queue/rssQueue";
import { eq } from "drizzle-orm";
import z from "zod";

export const feedRouter = {
  create: protectedProcedure
    .input(
      z.object({
        feedUrl: z.url(),
      })
    )
    .handler(async ({ context, input }) => {
      const user = context.session?.user;

      const existingFeed = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.userId, user.id),
            operators.eq(fields.feedUrl, input.feedUrl)
          );
        },
      });

      if (existingFeed) {
        return existingFeed;
      }

      const result = await db
        .insert(feed)
        .values({
          feedUrl: input.feedUrl,
          userId: user.id,
        })
        .returning();
      const record = result.at(0);
      if (record) {
        const job = await rssQueue.add("rssqueue", {
          feedId: record.id,
          feedUrl: record.feedUrl,
          userId: user.id,
        });

        const jobResult = await db
          .update(feed)
          .set({ jobId: job.id })
          .where(eq(feed.id, record.id))
          .returning();

        return jobResult.at(0);
      }
    }),
};
