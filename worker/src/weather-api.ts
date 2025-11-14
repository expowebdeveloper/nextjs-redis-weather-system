import { City, OpenMeteoResponse, WeatherData } from "./types";
import { WorkerConfig } from "./config";

export class WeatherAPI {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchWeatherForCity(city: City): Promise<WeatherData> {
    try {
      const url = `${this.baseUrl}/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`;
      
      console.log(`🌤️  Fetching weather for ${city.name} from ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as OpenMeteoResponse;
      
      if (!data.current_weather) {
        throw new Error("Invalid API response: missing current_weather");
      }

      if (!data.current_weather.time) {
        throw new Error("Invalid API response: missing time in current_weather");
      }

      return {
        city: city.name,
        temperature: data.current_weather.temperature,
        windSpeed: data.current_weather.windspeed,
        lastUpdated: new Date(data.current_weather.time),
      };
    } catch (error) {
      console.error(`❌ Error fetching weather for ${city.name}:`, error);
      throw error;
    }
  }

  async fetchWeatherForCities(cities: City[]): Promise<WeatherData[]> {
    const results: WeatherData[] = [];
    
    // Fetch weather for all cities in parallel
    const promises = cities.map((city) => this.fetchWeatherForCity(city));
    const settled = await Promise.allSettled(promises);

    for (let i = 0; i < settled.length; i++) {
      const result = settled[i];
      if (result.status === "fulfilled") {
        results.push(result.value);
        console.log(`✅ Successfully fetched weather for ${cities[i].name}`);
      } else {
        console.error(`❌ Failed to fetch weather for ${cities[i].name}:`, result.reason);
      }
    }

    return results;
  }
}

