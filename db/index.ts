import { config } from "dotenv";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// For local development, we should tell dotenv how to load the .env.local file
config({ path: [".env", ".env.local"] });

export const db = drizzle(process.env.DATABASE_URL!);
