import Redis from "ioredis";
import { getConfig } from "./config";
import { Database } from "./database";
import { WeatherAPI } from "./weather-api";
import { JobPayload } from "./types";

const config = getConfig();
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`Redis connection retry attempt ${times}, waiting ${delay}ms`);
    return delay;
  },
});

const database = new Database(config.postgres);
const weatherAPI = new WeatherAPI(config.openMeteoBaseUrl);

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

async function processJob(jobData: string): Promise<void> {
  try {
    const job: JobPayload = JSON.parse(jobData);
    console.log(
      `📦 Processing job with ${job.cities.length} cities (timestamp: ${new Date(job.timestamp).toISOString()})`
    );

    // Fetch weather data for all cities
    const weatherData = await weatherAPI.fetchWeatherForCities(job.cities);

    // Store in database
    for (const data of weatherData) {
      await database.upsertWeatherData(data);
      console.log(
        `💾 Stored weather data for ${data.city}: ${data.temperature}°C, ${data.windSpeed} km/h`
      );
    }

    console.log(`✅ Successfully processed job for ${weatherData.length} cities`);
  } catch (error) {
    console.error("❌ Error processing job:", error);
    throw error;
  }
}

async function startWorker() {
  console.log("🚀 Starting weather worker...");
  console.log(`📋 Configuration:`, {
    redis: `${config.redis.host}:${config.redis.port}`,
    postgres: `${config.postgres.host}:${config.postgres.port}/${config.postgres.database}`,
    queue: config.queueName,
  });

  // Connect to database
  await database.connect();

  // Start consuming jobs
  console.log(`👂 Listening for jobs on queue: ${config.queueName}`);

  while (true) {
    try {
      // Blocking pop from Redis queue (wait up to 5 seconds)
      const result = await redis.brpop(config.queueName, 5);
      
      if (result) {
        const [, jobData] = result;
        await processJob(jobData);
      }
    } catch (error) {
      console.error("❌ Error in worker loop:", error);
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  await redis.quit();
  await database.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...");
  await redis.quit();
  await database.close();
  process.exit(0);
});

// Start the worker
startWorker().catch((error) => {
  console.error("❌ Fatal error starting worker:", error);
  process.exit(1);
});

