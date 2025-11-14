/**
 * Types for worker service
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

export interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    windspeed: number;
    time: string;
  };
}

export interface WeatherData {
  city: string;
  temperature: number;
  windSpeed: number;
  lastUpdated: Date;
}

