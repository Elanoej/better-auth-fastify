import type { FastifyInstance } from "fastify";
import { z } from "zod";

export const healthRoute = async (fastify: FastifyInstance) => {
	fastify.get(
		"/health",
		{
			schema: {
				description: "Verifica se a API está online",
				tags: ["Health check"],
				response: {
					200: z.object({
						status: z.string(),
					}),
				},
			},
		},
		async () => {
			return { status: "ok" };
		},
	);
};
