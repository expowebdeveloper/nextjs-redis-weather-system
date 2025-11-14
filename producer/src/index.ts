import Redis from "ioredis";
import { getConfig } from "./config";
import { STANDARD_CITIES, JobPayload } from "./types";

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

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

async function enqueueJob() {
  try {
    const jobPayload: JobPayload = {
      cities: STANDARD_CITIES,
      timestamp: Date.now(),
    };

    await redis.lpush(config.queueName, JSON.stringify(jobPayload));
    
    // Track job history
    const historyKey = "weather-job-history";
    await redis.lpush(historyKey, jobPayload.timestamp.toString());
    await redis.ltrim(historyKey, 0, 99); // Keep last 100 jobs
    
    console.log(
      `✅ Enqueued weather job at ${new Date().toISOString()} for ${STANDARD_CITIES.length} cities`
    );
  } catch (error) {
    console.error("❌ Error enqueueing job:", error);
  }
}

async function startScheduler() {
  console.log("🚀 Starting weather job producer...");
  console.log(`📋 Configuration:`, {
    redis: `${config.redis.host}:${config.redis.port}`,
    queue: config.queueName,
    interval: `${config.jobInterval / 1000}s`,
  });

  // Enqueue initial job
  await enqueueJob();

  // Schedule periodic jobs
  setInterval(async () => {
    await enqueueJob();
  }, config.jobInterval);

  console.log(`⏰ Scheduler running - enqueueing jobs every ${config.jobInterval / 1000} seconds`);
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, closing Redis connection...");
  await redis.quit();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT, closing Redis connection...");
  await redis.quit();
  process.exit(0);
});

// Start the scheduler
startScheduler().catch((error) => {
  console.error("❌ Fatal error starting scheduler:", error);
  process.exit(1);
});

