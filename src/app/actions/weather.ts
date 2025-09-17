
'use server';

import { z } from 'zod';

const ForecastDaySchema = z.object({
  day: z.string(),
  temp: z.number(),
  condition: z.string(),
});

const WeatherSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  wind: z.number(),
  condition: z.string(),
  feelsLike: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
  forecast: z.array(ForecastDaySchema),
});

export type WeatherData = z.infer<typeof WeatherSchema>;

const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Fetches the current weather and a 6-day forecast for a given location.
 * In a real app, this would call a weather API.
 * For now, it returns realistic mock data.
 */
export async function getCurrentWeather(params: { district: string; state: string }): Promise<WeatherData> {
  console.log(`Fetching weather for ${params.district}, ${params.state}`);
  
  // Mock data based on some logic
  let condition = "Sunny";
  let temp = 30;
  let baseTemp = 30;

  if (['Kerala', 'Assam', 'Meghalaya'].includes(params.state)) {
    condition = "Rainy";
    baseTemp = 26;
  } else if (['Rajasthan', 'Gujarat'].includes(params.state)) {
    condition = "Sunny";
    baseTemp = 35;
  } else if (['Himachal Pradesh', 'Uttarakhand'].includes(params.state)) {
    condition = "Partly Cloudy";
    baseTemp = 22;
  }
  
  temp = baseTemp + Math.floor(Math.random() * 5) - 2;

  // Generate a dynamic 6-day forecast
  const forecast = Array.from({ length: 6 }).map((_, i) => {
      const forecastTemp = baseTemp + Math.floor(Math.random() * 6) - 3;
      const forecastCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const dayIndex = (new Date().getDay() + i + 1) % 7;
      return {
          day: days[dayIndex],
          temp: forecastTemp,
          condition: forecastCondition,
      };
  });


  return {
    temperature: temp,
    humidity: 68 + Math.floor(Math.random() * 10) - 5,
    wind: 12 + Math.floor(Math.random() * 8) - 4,
    condition: condition,
    feelsLike: temp + 2,
    sunrise: '5:45 AM',
    sunset: '7:15 PM',
    forecast,
  };
}
