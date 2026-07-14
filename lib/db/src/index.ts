import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "Warning: DATABASE_URL must be set. Database features will fail if accessed.",
  );
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL }) 
  : null;
export const db = pool ? drizzle(pool, { schema }) : null;

export * from "./schema";
