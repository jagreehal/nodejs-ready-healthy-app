import express from 'express';
import redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

import { MongoClient } from 'mongodb';
import { redisHealthCheck } from './services/cache';
import { mongoHealthCheck } from './services/mongo';
import { prismaHealthCheck } from './services/prisma';

const id = process.pid;

export type createAppProps = {
  mongo: MongoClient;
  redis: redis;
  prisma: PrismaClient;
};

export const createApp = async ({
  mongo,
  redis,
  prisma,
}: createAppProps): Promise<express.Application> => {
  const app = express();

  async function doHealthCheck() {
    const results = await Promise.all([
      redisHealthCheck(redis),
      mongoHealthCheck(mongo),
      prismaHealthCheck(prisma),
    ]);

    return {
      isHealthy: results.every((r) => r.status === 'ok'),
      results,
    };
  }

  app.get('/id', async (req, res) => {
    logger.info(`id: ${id}`);
    res.json({ id });
  });

  app.get('/increment', async (request, reply) => {
    const value = await redis.incr('counter');
    reply.send({ counter: value });
  });

  app.get('/redis/stop', async (req, res) => {
    await redis.quit();
    res.status(200).send();
  });

  app.get('/prisma', async (req, res) => {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.status(200).send({ result });
  });

  app.get('/ready', async (req, res) => {
    const { isHealthy } = await doHealthCheck();
    const statusCode = isHealthy ? 200 : 500;
    res.status(statusCode).send();
  });

  app.get('/healthcheck', async (req, res) => {
    const { isHealthy, results } = await doHealthCheck();

    const statusCode = isHealthy ? 200 : 500;
    res.status(statusCode).send(results);
  });

  return app;
};
