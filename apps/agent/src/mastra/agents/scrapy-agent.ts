import { Agent } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { openai } from "../../lib/openai";
import { scrapyTool } from "../tools/scrapy-tool";

export const scrapyAgent = new Agent({
  name: "Scrapy Agent",
  instructions: `
      You are a helpful agent that can scrape content from a URL.
      Use the scrapyTool to scrape content from a URL.
`,
  model: openai("gpt-4o-mini"),
  tools: { scrapyTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
