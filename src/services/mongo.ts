import { MongoClient } from 'mongodb';
import config from '../config';
import { logger } from '../logger';
import { AppService, IsConnectedResult } from '../types';
import { isConnectedCheckWithTimeoutFunction } from '../utils';

export let _mongoClient: MongoClient;

export const SERVICE_NAME = 'mongo';

export interface Mongo extends AppService {
  mongoClient: MongoClient;
}

async function connectMongo(retryAttempt = 1) {
  try {
    await _mongoClient.connect();
    logger.info('Connected to MONGO');
  } catch (err) {
    logger.error('Error connecting to MONGO', err);
    setTimeout(() => {
      connectMongo(retryAttempt + 1);
    }, Math.min(1000, 200 * retryAttempt));
  }
}

export function initMongo(mongoClient = createMongoClient()): Mongo {
  _mongoClient = mongoClient;
  connectMongo();
  return {
    isConnected,
    mongoClient: _mongoClient,
  };
}

export function createMongoClient() {
  const mongoClient = new MongoClient(config.MONGODB_URI, {
    connectTimeoutMS: 2000,
  });
  return mongoClient;
}

async function isConnected(): Promise<IsConnectedResult> {
  return isConnectedCheckWithTimeoutFunction(SERVICE_NAME, async () => {
    const r = await _mongoClient.db().command({ ping: 1 });
    return {
      name: SERVICE_NAME,
      status: r.ok === 1 ? 'connected' : 'not-connected',
    };
  });
}
