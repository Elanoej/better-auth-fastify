import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "@fastify/type-provider-zod";
import fastify from "fastify";
import { routes } from "./interfaces/routesConfig";
import { openApiConfig } from "./plugins/openapi";

export const buildApp = async () => {
	const app = fastify().withTypeProvider<ZodTypeProvider>();

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	await app.register(openApiConfig);

	await app.register(routes);

	return app;
};
