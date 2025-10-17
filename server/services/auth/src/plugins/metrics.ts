import fp from "fastify-plugin";
import promClient from 'prom-client';
import { FastifyInstance } from "fastify";

async function metricsPlugin(fastify: FastifyInstance) {

  const register = new promClient.Registry();
  register.setDefaultLabels({
  app: 'monitoring-article',
})};

app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});


