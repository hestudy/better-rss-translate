import { z } from "zod";

// RSS URL 验证 schema
export const rssUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message: "URL must be a valid HTTP or HTTPS URL",
    }
  );

// RSS 源可访问性检查
export async function validateRssAccessibility(url: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "RSS-Translate-Bot/1.0",
      },
      signal: AbortSignal.timeout(10000), // 10秒超时
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    // 检查 Content-Type 是否为 RSS/XML 相关
    const contentType = response.headers.get("content-type");
    if (contentType) {
      const isValidContentType =
        contentType.includes("xml") ||
        contentType.includes("rss") ||
        contentType.includes("atom") ||
        contentType.includes("application/rss+xml") ||
        contentType.includes("application/atom+xml") ||
        contentType.includes("text/xml");

      if (!isValidContentType) {
        return {
          isValid: false,
          error: `Invalid content type: ${contentType}. Expected XML/RSS content.`,
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// 完整的 RSS URL 验证（格式 + 可访问性）
export async function validateRssUrl(url: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  // 首先验证 URL 格式
  const formatValidation = rssUrlSchema.safeParse(url);
  if (!formatValidation.success) {
    return {
      isValid: false,
      error:
        formatValidation.error.issues?.[0]?.message || "Invalid URL format",
    };
  }

  // 然后验证可访问性
  return await validateRssAccessibility(url);
}
