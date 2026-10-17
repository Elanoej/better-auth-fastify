import type { FastifyInstance } from "fastify";
import { healthRoute } from "../interfaces/routes/health-route.js";
import { betterAuthRoutes } from "./betterAuthRoutes.js";

export const routes = async (app: FastifyInstance) => {
	app.register(healthRoute);
	app.register(betterAuthRoutes);
};
