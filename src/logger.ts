import pinoLogger from 'pino';
import config from './config';

export const logger = pinoLogger({
  level: config.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
  },
  options: {
    colorize: true,
  },
  timestamp: () => `,"time":"${Date.now()}"`,
});
