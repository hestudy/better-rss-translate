import { db } from "@/db";
import { feed } from "@/db/schema/feed";
import { protectedProcedure } from "@/lib/orpc";
import { rssQueue } from "@/queue/rssQueue";
import { and, desc, eq, like, or } from "drizzle-orm";
import z from "zod";

export const feedRouter = {
  create: protectedProcedure
    .input(
      z.object({
        feedUrl: z.url(),
        cron: z.string(),
        shouldScrapy: z.boolean().optional(),
        shouldTranslate: z.boolean().optional(),
        translateLanguage: z.string().optional(),
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
          cron: input.cron,
          shoudScrapy: input.shouldScrapy,
          shouldTranslate: input.shouldTranslate,
          translateLanguage: input.translateLanguage,
        })
        .returning();
      const record = result.at(0);
      if (record) {
        const job = await rssQueue.add(
          `rssqueue-${record.id}`,
          {
            feedId: record.id,
            feedUrl: record.feedUrl,
            userId: user.id,
          },
          {
            repeat: {
              pattern: input.cron,
            },
          }
        );

        const jobResult = await db
          .update(feed)
          .set({ jobId: job.id, jobStatus: "waiting" })
          .where(eq(feed.id, record.id))
          .returning();

        return jobResult.at(0);
      }
    }),
  page: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        keyword: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      const searchOp = and(eq(feed.userId, user.id));

      if (input.keyword) {
        searchOp?.append(
          or(
            like(feed.title, `%${input.keyword}%`),
            like(feed.description, `%${input.keyword}%`),
            like(feed.feedUrl, `%${input.keyword}%`)
          )!
        );
      }

      const page = await db.query.feed.findMany({
        where: searchOp,
        orderBy: [desc(feed.createDate)],
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
      });

      const total = await db.$count(feed, searchOp);

      return {
        page,
        total,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      const record = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.userId, user.id)
          );
        },
      });

      if (!record) {
        throw new Error("Feed not found");
      }

      if (record.jobId) {
        await rssQueue.removeJobScheduler(record.jobId);
        await rssQueue.remove(record.jobId);
      }

      const result = await db
        .delete(feed)
        .where(eq(feed.id, input.id))
        .returning();

      return result.at(0);
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        cron: z.string(),
        shouldScrapy: z.boolean().optional(),
        shouldTranslate: z.boolean().optional(),
        translateLanguage: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      const record = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.userId, user.id)
          );
        },
      });

      if (!record) {
        throw new Error("Feed not found");
      }

      if (record.jobId) {
        await rssQueue.removeJobScheduler(record.jobId);
        await rssQueue.remove(record.jobId);
      }

      const job = await rssQueue.add(
        `rssqueue-${record.id}`,
        {
          feedId: record.id,
          feedUrl: record.feedUrl,
          userId: user.id,
        },
        {
          repeat: {
            pattern: input.cron,
          },
        }
      );

      await job.moveToWait();

      const result = await db
        .update(feed)
        .set({
          cron: input.cron,
          jobId: job.id,
          jobStatus: "waiting",
          shoudScrapy: input.shouldScrapy,
          shouldTranslate: input.shouldTranslate,
          translateLanguage: input.translateLanguage,
        })
        .where(eq(feed.id, input.id))
        .returning();

      return result.at(0);
    }),
};
