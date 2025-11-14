/**
 * Environment configuration for worker service
 */

export interface WorkerConfig {
  redis: {
    host: string;
    port: number;
  };
  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  queueName: string;
  openMeteoBaseUrl: string;
}

export function getConfig(): WorkerConfig {
  return {
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
    },
    postgres: {
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
      user: process.env.POSTGRES_USER || "weather_user",
      password: process.env.POSTGRES_PASSWORD || "weather_pass",
      database: process.env.POSTGRES_DB || "weather_db",
    },
    queueName: process.env.REDIS_QUEUE_NAME || "weather-jobs",
    openMeteoBaseUrl: process.env.OPEN_METEO_BASE_URL || "https://api.open-meteo.com/v1",
  };
}

