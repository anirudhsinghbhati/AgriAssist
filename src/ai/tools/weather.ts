'use server';
/**
 * @fileOverview A Genkit tool for fetching real-time weather data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a simplified output schema for the tool.
const WeatherToolOutputSchema = z.object({
    temperature: z.number().describe('Current temperature in Celsius.'),
    humidity: z.number().describe('Current humidity percentage.'),
    forecast: z.string().describe('A brief weather forecast for the next 24 hours (e.g., "Sunny", "Partly Cloudy", "Chance of Rain").'),
});

export const getRealTimeWeather = ai.defineTool(
  {
    name: 'getRealTimeWeather',
    description: 'Returns the current weather conditions for a given district and state.',
    inputSchema: z.object({
      district: z.string().describe('The district to get the weather for.'),
      state: z.string().describe('The state where the district is located.'),
    }),
    outputSchema: WeatherToolOutputSchema,
  },
  async (input) => {
    // In a real application, you would call a weather API here.
    // For this demo, we'll return realistic mock data based on the location.
    console.log(`Fetching weather for ${input.district}, ${input.state}`);
    
    if (['Rajasthan', 'Gujarat'].includes(input.state)) {
         return {
            temperature: 35,
            humidity: 45,
            forecast: 'Sunny',
        };
    } else if (['Kerala', 'Assam'].includes(input.state)) {
        return {
            temperature: 28,
            humidity: 85,
            forecast: 'Rainy',
        };
    }

    return {
      temperature: 30,
      humidity: 70,
      forecast: 'Partly Cloudy',
    };
  }
);
