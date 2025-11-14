import { Pool } from "pg";

let pool: Pool | null = null;

export function getDatabasePool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
      user: process.env.POSTGRES_USER || "weather_user",
      password: process.env.POSTGRES_PASSWORD || "weather_pass",
      database: process.env.POSTGRES_DB || "weather_db",
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export interface WeatherDataRow {
  city: string;
  temperature: number;
  wind_speed: number;
  last_updated: Date;
}

