const config = {
  REDIS_URI: process.env.REDIS_URI!,
  PORT: Number(process.env.PORT!),
  HOST: process.env.HOST!,
  MONGODB_URI: process.env.MONGODB_URI!,
};

export default config;
