import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    const redis = getRedisClient();
    const historyKey = "weather-job-history";
    
    // Get last 20 job timestamps
    const history = await redis.lrange(historyKey, 0, 19);
    
    return NextResponse.json(
      {
        success: true,
        history: history.map((timestamp) => ({
          timestamp: new Date(parseInt(timestamp, 10)).toISOString(),
          triggeredBy: "Manual", // We'll enhance this later
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching job history:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch job history",
      },
      { status: 500 }
    );
  }
}

