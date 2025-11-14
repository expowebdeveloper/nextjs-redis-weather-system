"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🌤️</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Weather System
            </span>
          </div>
          <div className="flex gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/weather"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/weather"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              Weather Data
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

