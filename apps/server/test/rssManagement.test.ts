import { describe, expect, it, vi, beforeEach } from "vitest";
import { call } from "@orpc/server";
import { rssManagementRouter } from "@/routers/rssManagement";
import { getLoginSession } from "./auth.test";

// Mock the RSS validation service
vi.mock("@/services/rssValidationService", () => ({
  validateRssUrl: vi.fn().mockResolvedValue({ isValid: true }),
}));

// Mock fetch for RSS validation
global.fetch = vi.fn();

describe("RSS Management Router", () => {
  let session: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    session = await getLoginSession();

    // Mock successful RSS validation by default
    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: {
        get: vi.fn().mockReturnValue("application/rss+xml"),
      },
    });
  });

  describe("createSource", () => {
    it("should create a new RSS source", async () => {
      const timestamp = Date.now();
      const input = {
        name: "Test RSS Feed",
        feedUrl: `https://example-${timestamp}.com/rss.xml`,
        description: "A test RSS feed",
        fetchInterval: 60,
        status: "active" as const,
        shouldScrapy: false,
        shouldTranslate: false,
      };

      const result = await call(rssManagementRouter.createSource, input, {
        context: { session },
      });

      expect(result).toBeDefined();
      expect(result?.name).toBe(input.name);
      expect(result?.feedUrl).toBe(input.feedUrl);
      expect(result?.description).toBe(input.description);
      expect(result?.fetchInterval).toBe(input.fetchInterval);
      expect(result?.status).toBe(input.status);
    });

    it("should reject invalid URL", async () => {
      const input = {
        name: "Test RSS Feed",
        feedUrl: "not-a-valid-url",
        description: "A test RSS feed",
      };

      await expect(
        call(rssManagementRouter.createSource, input, { context: { session } })
      ).rejects.toThrow();
    });

    it("should reject empty name", async () => {
      const input = {
        name: "",
        feedUrl: "https://example.com/rss.xml",
      };

      await expect(
        call(rssManagementRouter.createSource, input, { context: { session } })
      ).rejects.toThrow();
    });
  });

  describe("getSources", () => {
    it("should get RSS sources with pagination", async () => {
      // First create a source
      const timestamp = Date.now();
      await call(
        rssManagementRouter.createSource,
        {
          name: "Test RSS Feed Pagination",
          feedUrl: `https://pagination-${timestamp}.example.com/rss.xml`,
          description: "A test RSS feed for pagination",
        },
        { context: { session } }
      );

      const result = await call(
        rssManagementRouter.getSources,
        { page: 1, pageSize: 10 },
        { context: { session } }
      );

      expect(result).toBeDefined();
      expect(result.sources).toBeDefined();
      expect(Array.isArray(result.sources)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it("should filter by keyword", async () => {
      // Create sources with different names
      const timestamp1 = Date.now();
      const timestamp2 = Date.now() + 1;

      await call(
        rssManagementRouter.createSource,
        {
          name: "Tech News RSS",
          feedUrl: `https://tech-${timestamp1}.example.com/rss.xml`,
        },
        { context: { session } }
      );

      await call(
        rssManagementRouter.createSource,
        {
          name: "Sports News RSS",
          feedUrl: `https://sports-${timestamp2}.example.com/rss.xml`,
        },
        { context: { session } }
      );

      const result = await call(
        rssManagementRouter.getSources,
        { page: 1, pageSize: 10, keyword: "Tech" },
        { context: { session } }
      );

      expect(result.sources.length).toBeGreaterThanOrEqual(1);
      expect(
        result.sources.some((source) => source.name?.includes("Tech"))
      ).toBe(true);
    });

    it("should filter by status", async () => {
      // Create a paused source
      const timestamp = Date.now();
      await call(
        rssManagementRouter.createSource,
        {
          name: "Paused RSS Feed",
          feedUrl: `https://paused-${timestamp}.example.com/rss.xml`,
          status: "paused",
        },
        { context: { session } }
      );

      const result = await call(
        rssManagementRouter.getSources,
        { page: 1, pageSize: 10, status: "paused" },
        { context: { session } }
      );

      expect(result.sources.every((source) => source.status === "paused")).toBe(
        true
      );
    });
  });

  describe("updateSource", () => {
    it("should update RSS source", async () => {
      // Create a source first
      const timestamp = Date.now();
      const created = await call(
        rssManagementRouter.createSource,
        {
          name: "Original Name",
          feedUrl: `https://update-${timestamp}.example.com/rss.xml`,
          status: "active",
        },
        { context: { session } }
      );

      const updated = await call(
        rssManagementRouter.updateSource,
        {
          id: created!.id,
          name: "Updated Name",
          status: "paused",
        },
        { context: { session } }
      );

      expect(updated?.name).toBe("Updated Name");
      expect(updated?.status).toBe("paused");
    });

    it("should reject update of non-existent source", async () => {
      await expect(
        call(
          rssManagementRouter.updateSource,
          {
            id: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID but non-existent
            name: "Updated Name",
          },
          { context: { session } }
        )
      ).rejects.toThrow("RSS source not found");
    });
  });

  describe("deleteSource", () => {
    it("should delete RSS source", async () => {
      // Create a source first
      const created = await call(
        rssManagementRouter.createSource,
        {
          name: "To Be Deleted",
          feedUrl: "https://delete.example.com/rss.xml",
        },
        { context: { session } }
      );

      const deleted = await call(
        rssManagementRouter.deleteSource,
        { id: created!.id },
        { context: { session } }
      );

      expect(deleted?.id).toBe(created!.id);
    });

    it("should reject deletion of non-existent source", async () => {
      await expect(
        call(
          rssManagementRouter.deleteSource,
          { id: "550e8400-e29b-41d4-a716-446655440001" }, // Valid UUID but non-existent
          { context: { session } }
        )
      ).rejects.toThrow("RSS source not found");
    });
  });

  describe("getSource", () => {
    it("should get single RSS source with items", async () => {
      // Create a source first
      const timestamp = Date.now();
      const created = await call(
        rssManagementRouter.createSource,
        {
          name: "Single Source",
          feedUrl: `https://single-${timestamp}.example.com/rss.xml`,
        },
        { context: { session } }
      );

      const source = await call(
        rssManagementRouter.getSource,
        { id: created!.id },
        { context: { session } }
      );

      expect(source).toBeDefined();
      expect(source?.id).toBe(created!.id);
      expect(source?.items).toBeDefined();
      expect(Array.isArray(source?.items)).toBe(true);
    });

    it("should reject getting non-existent source", async () => {
      await expect(
        call(
          rssManagementRouter.getSource,
          { id: "550e8400-e29b-41d4-a716-446655440002" }, // Valid UUID but non-existent
          { context: { session } }
        )
      ).rejects.toThrow("RSS source not found");
    });
  });
});
