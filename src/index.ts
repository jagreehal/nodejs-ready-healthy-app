import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { logger } from './logger';
import config from './config';
import { initMongo } from './services/mongo';
import { initCache } from './services/cache';

const { HOST, PORT } = config;
const id = process.pid;

async function start() {
  const cacheInstance = initCache();
  const mongoInstance = initMongo();
  const app = await createApp({
    cache: cacheInstance,
    mongo: mongoInstance,
  });
  return new Promise((resolve, reject) => {
    app.listen(PORT, HOST).once('listening', resolve).once('error', reject);
  });
}

start().then(() => {
  logger.info(`app:${id} is running at http://${HOST}:${PORT}`);
});
