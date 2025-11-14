/**
 * Types for producer service
 * (Copied from shared/types for simplicity)
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

export const STANDARD_CITIES: City[] = [
  { name: "London", latitude: 51.5072, longitude: -0.1276 },
  { name: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357 },
];

