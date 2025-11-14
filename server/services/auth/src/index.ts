"dotenv/config";
import Fastify from "fastify";
import crypto from "crypto";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
// import fastifyMetrics from "fastify-metrics";
// import fastifyCors from '@fastify/cors';


const fastify = Fastify({ logger: true });


// const ALLOWED_CORS = new Set([
// 	'http://localhost:8443',
// 	'http://127.0.0.1:8443',
// ]);

// await fastify.register(fastifyCors, {
// 	origin: (origin, cb) => {
// 		if (!origin) return cb(null, true);
// 		cb(null, ALLOWED_CORS.has(origin));
// 	},
// 	credentials: true,
// 	methods: ['GET', 'POST', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization'],
// });


fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET! });
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
// (fastify as any).register(fastifyMetrics, { endpoint: "/auth/metrics" });

let accessToken: string | null = null;
let tokenExpiry: number | null = null;


function generateState(): string {
	return crypto.randomBytes(16).toString("hex");
}

// declare module "fastify" {
	// 	interface FastifyInstance {
		// 		authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
		// 	}
		// }
		
		
		// fastify.decorate("authenticate", async function (request, reply) {
			// 	try {
				// 		await request.jwtVerify();
				// 	} catch (err) {
					// 		reply.code(401).send({ error: "Unauthorized, please authenticate." });
					// 	}
					// });
					
					// // fastify.get("/auth", { preHandler: [fastify.authenticate] }, async () => {
						// // 	return { message: "HELLO !!! /auth/42/login pour te connecter avec 42" };
						// // });
						
const pendingStates = new Map<string, number>();
						
						
fastify.get("/auth/42/login", async (_request: any, reply: any) => {
	const state = generateState();
	console.log("LOGIN - Generated state:", state);
	pendingStates.set(state, Date.now() + 5 * 60 * 1000);

	const url = `https://api.intra.42.fr/oauth/authorize` + `?client_id=${process.env.CLIENT_ID}` +
		`&redirect_uri=${encodeURIComponent("https://localhost:8443/auth/callback")}` +
		`&response_type=code` + `&state=${state}`;

	return reply.redirect(url);
});

fastify.get("/auth/callback", async (request: any, reply: any) => {

	const code = request.query.code;
	const state42 = request.query.state;

	if (!code || !state42)
		return reply.send({ Error: "No code sent" });
	const expiry = pendingStates.get(state42);
	if (!expiry || Date.now() > expiry) {
		return reply.code(400).send({ error: "Invalid or expired state" });
	}
	pendingStates.delete(state42);

	if (!accessToken || (tokenExpiry && Date.now() > tokenExpiry)) {
		const res = await fetch(`https://api.intra.42.fr/oauth/token`, {
			method: "POST",
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: process.env.CLIENT_ID!,
				client_secret: process.env.CLIENT_SECRET!,
				code: code,
				redirect_uri: process.env.REDIRECT_URI!
			}),
		})
		const data = await res.json();
		accessToken = data.access_token;
		tokenExpiry = Date.now() + data.expires_in * 1000;
		console.log("response : ", data)
		if (!data)
			return reply.code(500).send({ Error: "Token not accessible" });
	}
	return reply.redirect(`/auth/me`);
});

fastify.get("/auth/me", async (_request, reply) => {

	try {
		if (!accessToken) {
			return reply.code(401).send({ error: "not_authenticated" });
		}
		const res = await fetch("https://api.intra.42.fr/v2/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		if (!res.ok)
			return reply.code(res.status).send({ Error: "Fetch failed line 93" });

		const user = await res.json();
		const appToken = fastify.jwt.sign({
			id: user.id,
			login: user.login,
			email: user.email,
			image: user.image?.link,
		},
			{ expiresIn: '1h' }
		);
		return reply.setCookie('appToken', appToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			path: '/',
			maxAge: 60*60,
		}).redirect(`${process.env.FRONTEND_URL}/home`);
	}
	catch(err) {
		return reply.code(401).send({err: "Can not create cookie"});
	}
});

fastify.get("/auth/session", async (req, reply) => {
	const token = (req.cookies as any)?.appToken;
	if (!token)
		return reply.code(401).send({ error: "no cookie" });
	try {
		const payload = await fastify.jwt.verify(token) as any;
		return reply.send({ user: 
			{ 
				id: payload.id,
				login: payload.login,
				email: payload.email, 
				image: payload.image 
			} });
	} catch {
		return reply.code(401).send({ error: "invalid_token" });
	}
});

fastify.post('/auth/logout', async (_req, reply) => {
	reply.clearCookie('appToken', {
		httpOnly: true,
		secure: true,
		sameSite: 'none',
		path: '/',
	}).code(204).send();
});


await fastify.listen({ port: 3001, host: "0.0.0.0" });