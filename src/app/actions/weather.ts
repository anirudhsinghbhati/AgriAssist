'use server';

import { z } from 'zod';

const WeatherSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  wind: z.number(),
  condition: z.string(),
  feelsLike: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
});

export type WeatherData = z.infer<typeof WeatherSchema>;

/**
 * Fetches the current weather for a given location.
 * In a real app, this would call a weather API.
 * For now, it returns realistic mock data.
 */
export async function getCurrentWeather(params: { district: string; state: string }): Promise<WeatherData> {
  console.log(`Fetching weather for ${params.district}, ${params.state}`);
  
  // Mock data based on some logic
  let condition = "Sunny";
  let temp = 30;

  if (['Kerala', 'Assam', 'Meghalaya'].includes(params.state)) {
    condition = "Rainy";
    temp = 26;
  } else if (['Rajasthan', 'Gujarat'].includes(params.state)) {
    condition = "Sunny";
    temp = 35;
  } else if (['Himachal Pradesh', 'Uttarakhand'].includes(params.state)) {
    condition = "Partly Cloudy";
    temp = 22;
  }

  return {
    temperature: temp,
    humidity: 68,
    wind: 12,
    condition: condition,
    feelsLike: temp + 4,
    sunrise: '5:45 AM',
    sunset: '7:15 PM',
  };
}
