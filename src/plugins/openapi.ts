import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "@fastify/type-provider-zod";

export const openApiConfig = fp(
  async (app: FastifyInstance) => {
    await app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Teste do BetterAuth",
          description:
            "API criada para testar o betterAuth",
          version: "1.0.0",
        },
      },
      transform: jsonSchemaTransform,
    });
    await app.register(ScalarApiReference, {
      routePrefix: "/docs",
      configuration: {
        pageTitle: "Betther auth",
      },
    });
  },
  { name: "openapi" },
);