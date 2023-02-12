const config = {
  REDIS_URI: process.env.REDIS_URI!,
  PORT: Number(process.env.PORT!),
  HOST: process.env.HOST!,
  MONGODB_URI: process.env.MONGODB_URI!,
  DATABASE_URL: process.env.DATABASE_URL!,
  LOG_LEVEL: process.env.LOG_LEVEL!,
};

export default config;
