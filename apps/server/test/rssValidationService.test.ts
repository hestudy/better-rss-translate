import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  rssUrlSchema,
  validateRssAccessibility,
  validateRssUrl,
} from "@/services/rssValidationService";

// Mock fetch
global.fetch = vi.fn();

describe("RSS Validation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rssUrlSchema", () => {
    it("should validate valid HTTP URLs", () => {
      const result = rssUrlSchema.safeParse("http://example.com/rss.xml");
      expect(result.success).toBe(true);
    });

    it("should validate valid HTTPS URLs", () => {
      const result = rssUrlSchema.safeParse("https://example.com/rss.xml");
      expect(result.success).toBe(true);
    });

    it("should reject invalid URLs", () => {
      const result = rssUrlSchema.safeParse("not-a-url");
      expect(result.success).toBe(false);
    });

    it("should reject non-HTTP protocols", () => {
      const result = rssUrlSchema.safeParse("ftp://example.com/rss.xml");
      expect(result.success).toBe(false);
    });
  });

  describe("validateRssAccessibility", () => {
    it("should return valid for accessible RSS feed", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        headers: {
          get: vi.fn().mockReturnValue("application/rss+xml"),
        },
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await validateRssAccessibility(
        "https://example.com/rss.xml"
      );

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should return invalid for HTTP error responses", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: {
          get: vi.fn(),
        },
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await validateRssAccessibility(
        "https://example.com/notfound.xml"
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("HTTP 404: Not Found");
    });

    it("should return invalid for wrong content type", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        headers: {
          get: vi.fn().mockReturnValue("text/html"),
        },
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await validateRssAccessibility(
        "https://example.com/page.html"
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid content type: text/html");
    });

    it("should handle network errors", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await validateRssAccessibility(
        "https://example.com/rss.xml"
      );

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("should accept various XML content types", async () => {
      const validContentTypes = [
        "application/rss+xml",
        "application/atom+xml",
        "text/xml",
        "application/xml",
        "text/xml; charset=utf-8",
      ];

      for (const contentType of validContentTypes) {
        const mockResponse = {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: {
            get: vi.fn().mockReturnValue(contentType),
          },
        };

        (global.fetch as any).mockResolvedValueOnce(mockResponse);

        const result = await validateRssAccessibility(
          "https://example.com/rss.xml"
        );

        expect(result.isValid).toBe(true);
      }
    });
  });

  describe("validateRssUrl", () => {
    it("should validate both format and accessibility", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        headers: {
          get: vi.fn().mockReturnValue("application/rss+xml"),
        },
      };

      (global.fetch as any).mockResolvedValueOnce(mockResponse);

      const result = await validateRssUrl("https://example.com/rss.xml");

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should fail on invalid URL format", async () => {
      const result = await validateRssUrl("not-a-url");

      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid URL");
    });

    it("should fail on accessibility check even with valid format", async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      const result = await validateRssUrl("https://example.com/rss.xml");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });
});
