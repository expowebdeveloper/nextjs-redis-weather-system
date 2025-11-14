/**
 * Shared TypeScript interfaces and types for the weather system
 */

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface JobPayload {
  cities: City[];
  timestamp: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  windSpeed: number;
  lastUpdated: Date;
}

export interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    time: string;
  };
}

export interface DatabaseWeatherRow {
  city: string;
  temperature: number;
  wind_speed: number;
  last_updated: Date;
}

export const STANDARD_CITIES: City[] = [
  { name: "London", latitude: 51.5072, longitude: -0.1276 },
  { name: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
];

