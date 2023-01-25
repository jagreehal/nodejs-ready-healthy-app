import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { logger } from './logger';
import config from './config';
import { initMongo } from './services/mongo';
import { initRedis } from './services/cache';

const { HOST, PORT } = config;
const id = process.pid;

async function start() {
  const redis = initRedis();
  const mongo = initMongo();
  const app = await createApp({
    redis,
    mongo,
  });
  return new Promise((resolve, reject) => {
    app.listen(PORT, HOST).once('listening', resolve).once('error', reject);
  });
}

start().then(() => {
  logger.info(`app:${id} is running at http://${HOST}:${PORT}`);
});
