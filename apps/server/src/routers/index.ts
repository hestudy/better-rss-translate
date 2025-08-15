import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { feedRouter } from "./feed";
import { rssManagementRouter } from "./rssManagement";
import { todoRouter } from "./todo";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  todo: todoRouter,
  feed: feedRouter,
  rssManagement: rssManagementRouter,
};
export type AppRouter = typeof appRouter;
