import { FastifyPluginAsync } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";

const faviconPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), "public"),
	});

	fastify.get("/favicon.ico", async (_req, reply) => {
		return reply.sendFile("favicon.ico");
	});
};

export default faviconPlugin;
