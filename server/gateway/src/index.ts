import fastify from 'fastify'
import cors from '@fastify/cors';
// import proxy from '@fastify/http-proxy';
// import swagger from '@fastify/swagger';
// import swaggerUi from '@fastify/swagger-ui';
// import openapiGlue from "fastify-openapi-glue";
// import { specifications } from './specifications/index.js';


const server = fastify({logger: true})

server.register(cors, {
	origin: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
});


// const openApiOptions = {
//   specification: {specifications},
// };


// fastify.register(openapiGlue, options);

// server.register(swagger, {
// 	openapi: {
// 		info: {
// 			title: 'API Gateway - ft_transcendance',
// 			version: '1.0.0'
// 		},
// 		servers: [
// 			{ url: 'http://localhost:3000', description: 'API Gateway' }
// 		],
// 		components: {
// 			securitySchemes: {
// 				jwt: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
// 			}
// 		}
// 	}
// });

server.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	server.log?.info(`Server listening at ${address}`)
})