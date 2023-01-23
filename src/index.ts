import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { initCache } from './cache';
import { logger } from './logger';
import config from './config';

const { HOST, PORT } = config;
const id = process.pid;

async function start() {
  const cache = initCache();
  const app = await createApp({ cache });
  return new Promise((resolve, reject) => {
    app.listen(PORT, HOST).once('listening', resolve).once('error', reject);
  });
}

start().then(() => {
  logger.info(`app:${id} is running at http://${HOST}:${PORT}`);
});
