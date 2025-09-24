import fastify from 'fastify'
import faviconPlugin from "./plugins/favicon.js";


/* this function start the server */
export async function server (options = {logger: true}) {
	const app = fastify(options)

	app.get('/hello', async(request, reply) => {
		return ('hello')
	});
	
/* Add a favicon icone */
  await app.register(faviconPlugin);

/* ----*/

	return app;
}
