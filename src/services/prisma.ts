import { PrismaClient } from '@prisma/client';

import { logger } from '../logger';
import { HealthCheckResult } from '../types';
import { isConnectedCheckWithTimeoutFunction } from '../utils';

export const SERVICE_NAME = 'prisma(postgres)';

async function connectPrisma(prsimaClient: PrismaClient, retryAttempt = 1) {
  try {
    await await prsimaClient.$connect();
    logger.info(`Connected to ${SERVICE_NAME}`);
  } catch (err) {
    logger.error(`Error connecting to ${SERVICE_NAME}`, err);
    setTimeout(() => {
      connectPrisma(prsimaClient, retryAttempt + 1);
    }, Math.min(2000, 200 * retryAttempt));
  }
}

export function initPrisma(prismaClient = new PrismaClient()): PrismaClient {
  connectPrisma(prismaClient);
  return prismaClient;
}

export async function prismaHealthCheck(
  prismaClient: PrismaClient
): Promise<HealthCheckResult> {
  return isConnectedCheckWithTimeoutFunction(SERVICE_NAME, async () => {
    await prismaClient.$queryRaw`SELECT 1`;
    return {
      name: SERVICE_NAME,
      status: 'ok',
    };
  });
}
