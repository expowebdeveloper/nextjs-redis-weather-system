import { NextResponse } from "next/server";
import { getDatabasePool } from "@/lib/database";

export async function GET() {
  try {
    const pool = getDatabasePool();
    
    // Fetch all weather data
    const result = await pool.query(
      `SELECT city, temperature, wind_speed, last_updated 
       FROM weather_data 
       ORDER BY city`
    );

    // Get last sync timestamp
    const lastSyncResult = await pool.query(
      `SELECT MAX(last_updated) as last_sync FROM weather_data`
    );

    const lastSync = lastSyncResult.rows[0]?.last_sync || null;

    return NextResponse.json(
      {
        success: true,
        data: result.rows.map((row) => ({
          city: row.city,
          temperature: parseFloat(row.temperature),
          windSpeed: parseFloat(row.wind_speed),
          lastUpdated: row.last_updated,
        })),
        lastSync: lastSync,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch weather data",
      },
      { status: 500 }
    );
  }
}

