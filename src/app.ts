import express from 'express';
import { Mongo } from './services/mongo';
import { Cache } from './services/cache';
import { logger } from './logger';
import { checkServicesAreConnected } from './utils';

const id = process.pid;

export type createAppProps = {
  cache: Cache;
  mongo: Mongo;
};

export const createApp = async ({
  cache,
  mongo,
}: createAppProps): Promise<express.Application> => {
  const app = express();
  const services = [cache, mongo];

  app.get('/id', async (req, res) => {
    logger.info(`id: ${id}`);
    res.json({ id });
  });

  app.get('/ready', async (req, res) => {
    const result = await checkServicesAreConnected(services);

    return result.every((r) => r.status === 'connected')
      ? res.status(200).send('ok')
      : res.status(500).send('not ready');
  });

  app.get('/health', async (req, res) => {
    const result = await checkServicesAreConnected(services);

    return result.every((r) => r.status === 'connected')
      ? res.status(200).send(result)
      : res.status(500).send(result);
  });

  app.get('/increment', async (request, reply) => {
    const value = await cache.cache.incr('counter');
    reply.send({ counter: value });
  });

  app.get('/redis/stop', async (req, res) => {
    await cache.cache.quit();
    res.status(200).send();
  });

  return app;
};
