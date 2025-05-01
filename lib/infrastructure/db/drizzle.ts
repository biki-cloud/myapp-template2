import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getPostgresUrl } from "./env";

const client = postgres(getPostgresUrl());
const db = drizzle(client, { schema });

export type Database = typeof db;
export { db };
