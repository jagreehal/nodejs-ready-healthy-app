import express, { Response } from 'express';
import { logger } from './logger';
import { Cache } from './cache';

const id = process.pid;

export type createAppProps = {
  cache: Cache;
};

export const createApp = async ({
  cache,
}: createAppProps): Promise<express.Application> => {
  const app = express();

  app.get('/id', async (req, res) => {
    logger.info(`id: ${id}`);
    res.json({ id });
  });

  app.get('/ready', (req, res) => {
    return cache.isConnected()
      ? res.status(200).send({ cache: true })
      : res.status(500).send({ cache: false });
  });

  app.get('/health', async (req, res) => {
    try {
      await cache.redisClient.ping();
      res.status(200).send('Healthy');
    } catch (error) {
      res.status(500).send('Unhealthy');
    }
  });

  app.get('/increment', async (request, reply) => {
    const value = await cache.redisClient.incr('counter');
    reply.send({ counter: value });
  });

  app.get('/redis/stop', async (req, res) => {
    await cache.redisClient.quit();
    res.status(200).send();
  });

  return app;
};
