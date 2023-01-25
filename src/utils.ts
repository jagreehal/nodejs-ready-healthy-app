import { logger } from './logger';
import { AppService, IsConnectedResult } from './types';

async function checkIfConnected(
  name: string,
  f: () => Promise<IsConnectedResult>
): Promise<IsConnectedResult> {
  try {
    const result = await f();
    return result;
  } catch (err) {
    return {
      name,
      status: 'error',
    };
  }
}

export function isConnectedCheckWithTimeoutFunction(
  name,
  f: () => Promise<IsConnectedResult>
): Promise<IsConnectedResult> {
  return Promise.race([
    checkIfConnected(name, f),
    new Promise<IsConnectedResult>((resolve) => {
      setTimeout(() => {
        resolve({
          name,
          status: 'timed-out',
        });
      }, 5000);
    }),
  ]);
}

export async function checkServicesAreConnected(
  services: AppService[]
): Promise<IsConnectedResult[]> {
  const data = await Promise.allSettled(
    services.map((service) => service.isConnected())
  );

  const response = data.filter(
    (res) => res.status === 'fulfilled'
  ) as PromiseFulfilledResult<IsConnectedResult>[];

  return response.map((res) => res.value);
}
