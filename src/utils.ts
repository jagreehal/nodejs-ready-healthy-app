import { logger } from './logger';
import { HealthCheckResult } from './types';

async function checkIfConnected(
  name: string,
  f: () => Promise<HealthCheckResult>
): Promise<HealthCheckResult> {
  const _logger = logger.child({ module: 'checkIfConnected' });
  try {
    _logger.debug(`Checking if ${name} is connected`);
    const result = await f();
    return result;
  } catch (err) {
    console.log('xxxx', err);
    _logger.debug(`Error checking if ${name} is connected`, err);
    return {
      name,
      status: 'error',
    };
  }
}

export function isConnectedCheckWithTimeoutFunction(
  name,
  f: () => Promise<HealthCheckResult>
): Promise<HealthCheckResult> {
  return Promise.race([
    checkIfConnected(name, f),
    new Promise<HealthCheckResult>((resolve) => {
      setTimeout(() => {
        resolve({
          name,
          status: 'timed-out',
        });
      }, 5000);
    }),
  ]);
}
