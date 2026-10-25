import type { FastifyInstance } from "fastify";
import { healthRoute } from "../interfaces/routes/health-route.js";
import { betterAuthRoutes } from "./betterAuthRoutes.js";
import { aiRoute } from "./routes/ai-route.js";

export const routes = async (app: FastifyInstance) => {
	app.register(healthRoute);
	app.register(betterAuthRoutes);
	app.register(aiRoute);
};
