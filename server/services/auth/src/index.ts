"dotenv/config";
import Fastify from "fastify";
import crypto from "crypto";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";


const fastify = Fastify({ logger: true });

function generateState(): string {
	return crypto.randomBytes(16).toString("hex");
}

fastify.register(fastifyCookie, { secret: process.env.COOKIE_SECRET! });

fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET! });


let accessToken: string | null = null;
let tokenExpiry: number | null = null;

fastify.get("/", async () => {
	return { message: "HELLO !!! /auth/42/login pour te connecter avec 42" };
});


fastify.get("/auth/42/login", async (_request: any, reply: any) => {
	const state = generateState();
	console.log("LOGIN - Generated state:", state);
	reply.setCookie("oauth_cookie", state, {
		path: "/",
		httpOnly: true,
		sameSite: "none", // si 'lax', cela ne fonctionne pas avec Firefox
		secure: false,
	});
	const url = `https://api.intra.42.fr/oauth/authorize` + `?client_id=${process.env.CLIENT_ID}` +
		`&redirect_uri=${encodeURIComponent("http://localhost:3001/auth/callback")}` +
		`&response_type=code` + `&state=${state}`;

	return reply.redirect(url);
});

fastify.get("/auth/callback", async (request: any, reply: any) => {
	const code = request.query.code;
	const state42 = request.query.state;
	const cookieState = request.cookies.oauth_cookie;

	if (!code || !state42)
		return reply.send({ Error: "No code sent" });
	if (cookieState !== state42)
		return reply.code(400).send({ Error: "Wrong state received" });
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
	return reply.redirect(`/me`);
});

fastify.get("/me", async (_request, reply) => {
	if (!accessToken) {
		return reply.code(401).send({ error: "not_authenticated" });
	}
	const res = await fetch("https://api.intra.42.fr/v2/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok)
		return reply.code(res.status).send({Error: "Fetch failed line 93" });
	const user = await res.json();
	const appToken = fastify.jwt.sign({
		id: user.id,
		login: user.login,
		email: user.email,
		image: user.image?.link,
	});
	reply.setCookie("appToken", appToken, {
		httpOnly: true,
		sameSite: "lax",
	});
	return reply.send({
		id: user.id,
		login: user.login,
		email: user.email,
		image: user.image?.link,
	});
});



await fastify.listen({ port: 3001, host: "0.0.0.0" });