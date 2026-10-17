import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "@/db";

export const db = drizzle(process.env.DATABASE_URL!, { relations });
