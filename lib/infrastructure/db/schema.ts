import {
  pgSchema,
  serial,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { getSchema } from "./env";

// スキーマを定義
export const schema = pgSchema(getSchema());

export const user = schema.table("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type UserRow = typeof user.$inferSelect;
