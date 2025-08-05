import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as todo from "./schema/todo";
import * as auth from "./schema/auth";
import * as feed from "./schema/feed";

const client = createClient({
  url: process.env.DATABASE_URL || "",
});

export const db = drizzle({ client, schema: { ...todo, ...auth, ...feed } });
