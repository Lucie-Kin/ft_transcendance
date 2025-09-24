import fastify from 'fastify'
import path from "path";
import fastifyFavicon from 'fastify-favicon';


/* this function start the server */
export async function server (options = {logger: true}) {
	const app = fastify(options)

	app.get('/hello', async(request, reply) => {
		return ('hello')
	});
	
/* Add a favicon icone */
	app.register(fastifyFavicon, {
		path: path.join(process.cwd(), "public"),
		name: 'fastifyFavicon.ico'
	});
/* ----*/

	return app;
}
