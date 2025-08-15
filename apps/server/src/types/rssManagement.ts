import { z } from "zod";
import type { feed, feeditem } from "@/db/schema/feed";

// RSS 源状态枚举
export const RssSourceStatus = {
  ACTIVE: "active",
  PAUSED: "paused",
  ERROR: "error",
} as const;

export type RssSourceStatusType = typeof RssSourceStatus[keyof typeof RssSourceStatus];

// RSS 源基础类型
export type RssSource = typeof feed.$inferSelect;
export type RssSourceInsert = typeof feed.$inferInsert;
export type RssSourceUpdate = Partial<Omit<RssSourceInsert, "id" | "userId" | "createDate">>;

// RSS 文章类型
export type RssItem = typeof feeditem.$inferSelect;

// RSS 源详情（包含最近的文章）
export type RssSourceWithItems = RssSource & {
  items: RssItem[];
};

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// RSS 源列表响应
export type RssSourceListResponse = {
  sources: RssSource[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// RSS 验证结果
export interface RssValidationResult {
  isValid: boolean;
  error?: string;
}

// 创建 RSS 源的输入验证 schema
export const createRssSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  feedUrl: z.string().url("Invalid URL format"),
  description: z.string().max(1000, "Description too long").optional(),
  fetchInterval: z.number().min(1, "Fetch interval must be at least 1 minute").max(10080, "Fetch interval cannot exceed 1 week").default(60),
  status: z.enum(["active", "paused"]).default("active"),
  shouldScrapy: z.boolean().default(false),
  shouldTranslate: z.boolean().default(false),
  translateLanguage: z.string().optional(),
});

// 更新 RSS 源的输入验证 schema
export const updateRssSourceSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
  name: z.string().min(1, "Name is required").max(255, "Name too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  fetchInterval: z.number().min(1, "Fetch interval must be at least 1 minute").max(10080, "Fetch interval cannot exceed 1 week").optional(),
  status: z.enum(["active", "paused", "error"]).optional(),
  shouldScrapy: z.boolean().optional(),
  shouldTranslate: z.boolean().optional(),
  translateLanguage: z.string().optional(),
});

// 查询 RSS 源列表的输入验证 schema
export const getRssSourcesSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  keyword: z.string().optional(),
  status: z.enum(["active", "paused", "error"]).optional(),
});

// RSS 源 ID 验证 schema
export const rssSourceIdSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

// 导出类型推断
export type CreateRssSourceInput = z.infer<typeof createRssSourceSchema>;
export type UpdateRssSourceInput = z.infer<typeof updateRssSourceSchema>;
export type GetRssSourcesInput = z.infer<typeof getRssSourcesSchema>;
export type RssSourceIdInput = z.infer<typeof rssSourceIdSchema>;
