import { Pool, PoolClient } from "pg";
import { WorkerConfig } from "./config";
import { WeatherData } from "./types";

export class Database {
  private pool: Pool;

  constructor(config: WorkerConfig["postgres"]) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("error", (err) => {
      console.error("❌ Unexpected database error:", err);
    });
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log("✅ Connected to PostgreSQL");
      client.release();
    } catch (error) {
      console.error("❌ Failed to connect to PostgreSQL:", error);
      throw error;
    }
  }

  async upsertWeatherData(data: WeatherData): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query(
        `INSERT INTO weather_data (city, temperature, wind_speed, last_updated)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (city)
         DO UPDATE SET
           temperature = EXCLUDED.temperature,
           wind_speed = EXCLUDED.wind_speed,
           last_updated = EXCLUDED.last_updated
         WHERE EXCLUDED.last_updated >= weather_data.last_updated`,
        [data.city, data.temperature, data.windSpeed, data.lastUpdated]
      );
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

