import { createTool } from "@mastra/core";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import z from "zod";

export const scrapyTool = createTool({
  id: "scrapy-tool",
  description: "Scrape content from a URL",
  inputSchema: z.object({
    url: z.string().describe("URL to scrape"),
  }),
  outputSchema: z
    .object({
      content: z.string().nullish().describe("Content of the page"),
    })
    .nullable(),
  execute: async ({ context }) => {
    return await scrapeContent(context.url);
  },
});

const scrapeContent = async (url: string) => {
  const dom = await JSDOM.fromURL(url);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article;
};
