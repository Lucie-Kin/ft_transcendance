"dotenv/config";
import Fastify from "fastify";
import crypto from "crypto";
// import fastifyCookie from "fastify-cookie";
import fastifyCookie from "@fastify/cookie";
// import oauth42 from "./plugins/oauth.js";
// import fastifyCookie from "@fastify/cookie";
// import prismaPlugin from "./plugins/prisma.js";
// import oauth42 from "./plugins/oauth.js";
// import playersRoutes from "./routes/players.js";
// import tournamentRoutes from "./routes/tournament.js";
// import usersRoutes from "./routes/users.js";

// declare var data;
const fastify = Fastify({ logger: true });

function generateState(): string {
	return crypto.randomBytes(16).toString("hex");
}

fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET! });

// await fastify.register(prismaPlugin);
// await fastify.register(oauth42);
// fastify.after(() => {
//	console.log("✅ OAuth plugin chargé:", fastify.fortytwoOAuth);
// });

// await fastify.register(usersRoutes, { prefix: "/users" });
// fastify.register(playersRoutes, { prefix: "/players" });
// fastify.register(tournamentRoutes, {prefix: '/tournament'});

fastify.get("/", async () => {
	return { message: "HELLO !!! /auth/42/login pour te connecter avec 42" };
});


fastify.get("/auth/42/login", async (_request: any, reply: any) => {
	const state = generateState();
	console.log("LOGIN - Generated state:", state);
	reply.setCookie("oauth_cookie", state, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: false,
	});
	const url = `https://api.intra.42.fr/oauth/authorize` + `?client_id=${process.env.CLIENT_ID}` +
		`&redirect_uri=${encodeURIComponent("http://localhost:3000/auth/callback")}` +
		`&response_type=code` + `&state=${state}`;

	return reply.redirect(url);
});


fastify.get("/auth/callback", async (request:any, reply:any) => {
	const code = request.query.code;
	const state42 = request.query.state;
	const cookieState = request.cookies.oauth_cookie;

	if (!code || !state42)
		return reply.send({Error: "No code sent"});
	if (cookieState !== state42)
		return reply.code(400).send({Error: "Wrong state received"});
	return reply.redirect(`http://localhost:3000/auth/token`); 
});

fastify.get("/auth/token", async (_request: any, reply: any) => {
	const res = await fetch(`https://api.intra.42.fr/oauth/token` , {
	method: "POST",
	body: new URLSearchParams({
		grant_type: "client_credentials",
		client_id: process.env.CLIENT_ID!,
		client_secret: process.env.CLIENT_SECRET!,
		}),
	})
	const data = await res.json();
	console.log("response : ", data)
	if (!data)
		return reply.code(500).send({Error: "Token not accessible" });

});

// function accessDataWithToken(data: any): any {

// };


await fastify.listen({ port: 3000, host: "0.0.0.0" });