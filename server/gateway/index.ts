import {FastifyInstance} from 'fastify'
import dotenv from 'dotenv'
import { server } from'./src/app.js'
// import cors from '@fastify/cors';
// import proxy from '@fastify/http-proxy';
// import swagger from '@fastify/swagger';
// import swaggerUi from '@fastify/swagger-ui';
// import openApiGlue from "fastify-openapi-glue";
// import { specifications } from './specifications/index.js';

dotenv.config();


const start = async() => {
	let app: FastifyInstance | null = null
	try {
		app = await server({logger: true});
		await app.listen({ port: 3000, host: '0.0.0.0' })
	}
	catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start();


// app.register(cors, {
// 	origin: 'http://localhost:5173',
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization']
// });

// // const openApiOptions = {
// //   specification: {specifications},
// // };

// // fastify.register(openapiGlue, options);

// app.register(swagger, {
// 	openapi: {
// 		info: {
// 			title: 'API Gateway - ft_transcendance',
// 			version: '1.0.0'
// 		},
// 		apps: [
// 			{ url: 'http://localhost:3000', description: 'API Gateway' }
// 		],
// 		components: {
// 			securitySchemes: {
// 				jwt: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
// 			}
// 		}
// 	}
// });

// app.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
// 	if (err) {
// 		app.log.error(err)
// 		process.exit(1)
// 	}
// 	app.log?.info(`Serverlistening at ${address}`)
// })

// import fastify, { FastifyInstance } from 'fastify';
// import cors from '@fastify/cors';
// import proxy from '@fastify/http-proxy';
// import swagger from '@fastify/swagger';
// import swaggerUi from '@fastify/swagger-ui';
// import openapiGlue from 'fastify-openapi-glue';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const start = async () => {
// 	let app: FastifyInstance | null = null; // Correct type: FastifyInstance
// 	try {
// 		app = fastify({ logger: true }); // Initialize Fastify instance

// 		// Enable CORS for SPA
// 		await app.register(cors, {
// 			origin: 'http://localhost:5173',
// 			credentials: true,
// 			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 			allowedHeaders: ['Content-Type', 'Authorization']
// 		});

// 		// Register OpenAPI specification with fastify-openapi-glue
// 		await app.register(openapiGlue, {
// 			specification: join(__dirname, 'openapi.yaml'),
// 			service: join(__dirname, 'service.js')
// 		});

// 		// Register Swagger for OpenAPI documentation
// 		await app.register(swagger, {
// 			openapi: {
// 				info: {
// 					title: 'API Gateway - ft_transcendance',
// 					description: 'API Gateway for ft_transcendance, routing to auth service',
// 					version: '1.0.0'
// 				},
// 				servers: [
// 					{ url: 'http://localhost:3000', description: 'API Gateway' }
// 				],
// 				components: {
// 					securitySchemes: {
// 						jwt: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
// 					}
// 				}
// 			}
// 		});

// 		// Register Swagger UI
// 		await app.register(swaggerUi, {
// 			routePrefix: '/docs',
// 			uiConfig: { docExpansion: 'full', deepLinking: false },
// 			staticCSP: true
// 		});

// 		// Health endpoint
// 		app.get('/health', {
// 			schema: {
// 				description: 'Check API Gateway status',
// 				tags: ['Gateway'],
// 				response: {
// 					200: { type: 'object', properties: { status: { type: 'string' } } }
// 				}
// 			}
// 		}, async (request, reply) => {
// 			return { status: 'OK' };
// 		});

// 		// Proxy to auth service
// 		await app.register(proxy, {
// 			upstream: 'http://auth:3001',
// 			prefix: '/auth',
// 			http2: false,
// 			replyOptions: {
// 				rewriteRequestHeaders: (request, headers) => ({
// 					...headers,
// 					'x-forwarded-host': request.headers.host
// 				})
// 			}
// 		});

// 		// Start server
// 		await app.listen({ port: 3000 });
// 	} catch (err) {
// 		if (app) {
// 			app.log.error(err); // Use Fastify logger if `app` is defined
// 		} else {
// 			console.error('Error initializing server:', err); // Fallback logger
// 		}
// 		process.exit(1);
// 	}
// };

// start();