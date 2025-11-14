"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  city: string;
  temperature: number;
  windSpeed: number;
  lastUpdated: string;
}

interface WeatherResponse {
  success: boolean;
  data: WeatherData[];
  lastSync: string | null;
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/weather");
      const data: WeatherResponse = await response.json();
      
      if (data.success) {
        setWeatherData(data.data);
        setLastSync(data.lastSync);
        setError(null);
      } else {
        setError("Failed to fetch weather data");
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    // Refresh data every 10 seconds
    const interval = setInterval(fetchWeatherData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return "from-blue-400 to-blue-600";
    if (temp < 10) return "from-cyan-400 to-cyan-600";
    if (temp < 20) return "from-green-400 to-green-600";
    if (temp < 30) return "from-yellow-400 to-orange-500";
    return "from-orange-500 to-red-600";
  };

  const getCityEmoji = (city: string) => {
    const emojis: { [key: string]: string } = {
      London: "🇬🇧",
      "New York": "🇺🇸",
      Tokyo: "🇯🇵",
      Cairo: "🇪🇬",
    };
    return emojis[city] || "🌍";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Weather Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time weather information for major cities
          </p>
        </div>

        {loading && weatherData.length === 0 ? (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-zinc-800/50 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
            </div>
            <button
              onClick={fetchWeatherData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {weatherData.length === 0 ? (
              <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-zinc-800/50 p-12 text-center">
                <div className="text-6xl mb-4">🌤️</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                  No weather data available
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Please trigger a job from the dashboard to fetch weather data.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {weatherData.map((weather) => (
                  <div
                    key={weather.city}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{getCityEmoji(weather.city)}</div>
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTemperatureColor(weather.temperature)} flex items-center justify-center shadow-md`}>
                        <span className="text-white text-2xl font-bold">
                          {Math.round(weather.temperature)}°
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {weather.city}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌡️</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {weather.temperature.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💨</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {weather.windSpeed.toFixed(1)} km/h
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>🕐</span>
                          <span>{formatDate(weather.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lastSync && (
              <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last sync</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(lastSync)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

