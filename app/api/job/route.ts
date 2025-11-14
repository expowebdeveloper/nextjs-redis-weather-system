import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

const STANDARD_CITIES = [
  { name: "London", latitude: 51.5072, longitude: -0.1276 },
  { name: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
];

export async function POST(request: NextRequest) {
  try {
    const redis = getRedisClient();
    const queueName = process.env.REDIS_QUEUE_NAME || "weather-jobs";

    const jobPayload = {
      cities: STANDARD_CITIES,
      timestamp: Date.now(),
    };

    await redis.lpush(queueName, JSON.stringify(jobPayload));
    
    // Track job history
    const historyKey = "weather-job-history";
    await redis.lpush(historyKey, jobPayload.timestamp.toString());
    await redis.ltrim(historyKey, 0, 99); // Keep last 100 jobs

    return NextResponse.json(
      {
        success: true,
        message: "Job enqueued successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error enqueueing job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to enqueue job",
      },
      { status: 500 }
    );
  }
}

