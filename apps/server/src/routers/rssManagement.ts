import { db } from "@/db";
import { feed } from "@/db/schema/feed";
import { protectedProcedure } from "@/lib/orpc";
import { validateRssUrl } from "@/services/rssValidationService";
import { and, desc, eq, like, or } from "drizzle-orm";
import z from "zod";

export const rssManagementRouter = {
  // GET /sources - 获取 RSS 源列表（支持分页和搜索）
  getSources: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        keyword: z.string().optional(),
        status: z.enum(["active", "paused", "error"]).optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      const conditions = [eq(feed.userId, user.id)];

      // 添加关键词搜索条件
      if (input.keyword) {
        conditions.push(
          or(
            like(feed.name, `%${input.keyword}%`),
            like(feed.title, `%${input.keyword}%`),
            like(feed.description, `%${input.keyword}%`),
            like(feed.feedUrl, `%${input.keyword}%`)
          )!
        );
      }

      // 添加状态过滤条件
      if (input.status) {
        conditions.push(eq(feed.status, input.status));
      }

      const searchCondition = and(...conditions);

      const sources = await db.query.feed.findMany({
        where: searchCondition,
        orderBy: [desc(feed.createDate)],
        limit: input.pageSize,
        offset: (input.page - 1) * input.pageSize,
      });

      const total = await db.$count(feed, searchCondition);

      return {
        sources,
        total,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: Math.ceil(total / input.pageSize),
      };
    }),

  // POST /sources - 创建新 RSS 源
  createSource: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        feedUrl: z.string().url("Invalid URL format"),
        description: z.string().optional(),
        fetchInterval: z.number().min(1).default(60), // 分钟
        status: z.enum(["active", "paused"]).default("active"),
        shouldScrapy: z.boolean().default(false),
        shouldTranslate: z.boolean().default(false),
        translateLanguage: z.string().optional(),
      })
    )
    .handler(async ({ context, input }) => {
      const user = context.session?.user;

      // 验证 RSS URL
      const validation = await validateRssUrl(input.feedUrl);
      if (!validation.isValid) {
        throw new Error(`RSS URL validation failed: ${validation.error}`);
      }

      // 检查是否已存在相同的 RSS 源
      const existingFeed = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.userId, user.id),
            operators.eq(fields.feedUrl, input.feedUrl)
          );
        },
      });

      if (existingFeed) {
        throw new Error("RSS source with this URL already exists");
      }

      const result = await db
        .insert(feed)
        .values({
          name: input.name,
          feedUrl: input.feedUrl,
          description: input.description,
          fetchInterval: input.fetchInterval,
          status: input.status,
          userId: user.id,
          shouldScrapy: input.shouldScrapy,
          shouldTranslate: input.shouldTranslate,
          translateLanguage: input.translateLanguage,
        })
        .returning();

      return result.at(0);
    }),

  // PUT /sources/:id - 更新 RSS 源信息
  updateSource: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid RSS source ID format"),
        name: z.string().min(1, "Name is required").optional(),
        description: z.string().optional(),
        fetchInterval: z.number().min(1).optional(),
        status: z.enum(["active", "paused", "error"]).optional(),
        shouldScrapy: z.boolean().optional(),
        shouldTranslate: z.boolean().optional(),
        translateLanguage: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      // 检查 RSS 源是否存在且属于当前用户
      const existingSource = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.userId, user.id)
          );
        },
      });

      if (!existingSource) {
        throw new Error("RSS source not found");
      }

      // 准备更新数据
      const updateData: Partial<typeof feed.$inferInsert> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.fetchInterval !== undefined)
        updateData.fetchInterval = input.fetchInterval;
      if (input.status !== undefined) updateData.status = input.status;
      if (input.shouldScrapy !== undefined)
        updateData.shouldScrapy = input.shouldScrapy;
      if (input.shouldTranslate !== undefined)
        updateData.shouldTranslate = input.shouldTranslate;
      if (input.translateLanguage !== undefined)
        updateData.translateLanguage = input.translateLanguage;

      const result = await db
        .update(feed)
        .set(updateData)
        .where(eq(feed.id, input.id))
        .returning();

      return result.at(0);
    }),

  // DELETE /sources/:id - 删除 RSS 源
  deleteSource: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid RSS source ID format"),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      // 检查 RSS 源是否存在且属于当前用户
      const existingSource = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.userId, user.id)
          );
        },
      });

      if (!existingSource) {
        throw new Error("RSS source not found");
      }

      // 删除 RSS 源（级联删除会自动删除相关的 feeditem）
      const result = await db
        .delete(feed)
        .where(eq(feed.id, input.id))
        .returning();

      return result.at(0);
    }),

  // GET /sources/:id - 获取单个 RSS 源详情
  getSource: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("Invalid RSS source ID format"),
      })
    )
    .handler(async ({ input, context }) => {
      const user = context.session?.user;

      const source = await db.query.feed.findFirst({
        where(fields, operators) {
          return operators.and(
            operators.eq(fields.id, input.id),
            operators.eq(fields.userId, user.id)
          );
        },
        with: {
          items: {
            limit: 10,
            orderBy: (feeditem, { desc }) => [desc(feeditem.createDate)],
          },
        },
      });

      if (!source) {
        throw new Error("RSS source not found");
      }

      return source;
    }),
};
