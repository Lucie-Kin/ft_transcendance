import fastify from 'fastify'

/* this function start the server */
export async function server (options = {logger: true}) {
	const app = fastify(options)

	app.get('/hello', async(request, reply) => {
		return ('hello')
	});
	


	return app;
}
