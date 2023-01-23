import pinoLogger from 'pino';

export const logger = pinoLogger({
  transport: {
    target: 'pino-pretty',
  },
  options: {
    colorize: true,
  },
  timestamp: () => `,"time":"${Date.now()}"`,
});
