"use client";

import { useState, useEffect } from "react";

interface JobHistoryItem {
  timestamp: string;
  triggeredBy: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [jobHistory, setJobHistory] = useState<JobHistoryItem[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchJobHistory = async () => {
    try {
      const response = await fetch("/api/job/history");
      const data = await response.json();
      if (data.success) {
        setJobHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching job history:", error);
    }
  };

  useEffect(() => {
    fetchJobHistory();
    // Refresh history every 5 seconds
    const interval = setInterval(fetchJobHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFetchWeather = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/job", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setMessage("✅ Weather job enqueued successfully!");
        await fetchJobHistory();
      } else {
        setMessage("❌ Failed to enqueue job");
      }
    } catch (error) {
      console.error("Error enqueueing job:", error);
      setMessage("❌ Error enqueueing job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Weather System Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage weather data fetching jobs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Manual Job Trigger Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Manual Job Trigger
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fetch weather data now
                </p>
              </div>
            </div>
            <button
              onClick={handleFetchWeather}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enqueueing...
                </>
              ) : (
                <>
                  <span>🌤️</span>
                  Fetch Weather Now
                </>
              )}
            </button>
            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes("✅") 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}>
                <p className={`text-sm font-medium ${
                  message.includes("✅") 
                    ? "text-green-700 dark:text-green-400" 
                    : "text-red-700 dark:text-red-400"
                }`}>
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Job Statistics
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total jobs processed
                </p>
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {jobHistory.length}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {jobHistory.length === 0 
                ? "No jobs yet" 
                : `${jobHistory.length} job${jobHistory.length > 1 ? 's' : ''} in history`}
            </p>
          </div>
        </div>

        {/* Job History Card */}
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Job History
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest weather fetch jobs
              </p>
            </div>
          </div>
          {jobHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No jobs have been triggered yet.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 cursor-pointer">
                Click "Fetch Weather Now" to start
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Timestamp
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Triggered By
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.map((job, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300"> 
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🕐</span>
                          {new Date(job.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                          {job.triggeredBy === "Manual" ? "👤" : "⏰"}
                          {job.triggeredBy}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                          <span>✓</span>
                          <span className="text-sm font-medium">Completed</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
