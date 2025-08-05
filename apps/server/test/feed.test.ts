import { feedRouter } from "@/routers/feed";
import { call } from "@orpc/server";
import { expect, it } from "vitest";

it("create feed", async () => {
  const res = await call(
    feedRouter.create,
    {
      feedUrl: "https://thisweekinreact.com/newsletter/rss.xml",
    },
    {
      context: {
        session: {
          user: {
            id: "lyxSu9rXsNSCw83CgEUe6mOQu6FTECjX",
            name: "test",
            createdAt: new Date(),
            email: "test@test.com",
            emailVerified: true,
            updatedAt: new Date(),
          },
          session: {
            createdAt: new Date(),
            id: "6xSdt7UwMggX3oaMDQn253YxmsjWcFhB",
            expiresAt: new Date(),
            token: "6xSdt7UwMggX3oaMDQn253YxmsjWcFhB",
            userId: "lyxSu9rXsNSCw83CgEUe6mOQu6FTECjX",
            updatedAt: new Date(),
          },
        },
      },
    }
  );
  expect(res?.id).toBeDefined();
});
