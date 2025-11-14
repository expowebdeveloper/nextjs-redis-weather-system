/**
 * Environment configuration for producer service
 */

export interface ProducerConfig {
  redis: {
    host: string;
    port: number;
  };
  jobInterval: number; // in milliseconds
  queueName: string;
}

export function getConfig(): ProducerConfig {
  return {
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
    jobInterval: parseInt(process.env.JOB_INTERVAL_MS || "60000", 10), // 60 seconds default
    queueName: process.env.REDIS_QUEUE_NAME || "weather-jobs",
  };
}

