import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
  }
  return redis;
}

