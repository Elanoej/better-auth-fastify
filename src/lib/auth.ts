import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { tableSchemas } from "@/db";
import { db } from "./database";

export const auth = betterAuth({
	trustedOrigins: ["http://localhost:3333"],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: tableSchemas,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
});
