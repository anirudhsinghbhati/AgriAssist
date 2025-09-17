
'use server';
/**
 * @fileOverview A Genkit tool for fetching real-time weather data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const getRealTimeWeather = ai.defineTool(
  {
    name: 'getRealTimeWeather',
    description: 'Returns the current weather conditions for a given district and state.',
    inputSchema: z.object({
      district: z.string().describe('The district to get the weather for.'),
      state: z.string().describe('The state where the district is located.'),
    }),
    outputSchema: z.object({
      temperature: z.number().describe('Current temperature in Celsius.'),
      humidity: z.number().describe('Current humidity percentage.'),
      rainfall: z.string().describe('Rainfall forecast for the next 24-48 hours (e.g., "No rain expected", "Light showers", "Heavy rain").'),
    }),
  },
  async (input) => {
    // In a real application, you would call a weather API here.
    // For this demo, we'll return realistic mock data.
    console.log(`Fetching weather for ${input.district}, ${input.state}`);
    
    // Simple logic to return different weather for different regions for demonstration
    if (['Rajasthan', 'Gujarat', 'Madhya Pradesh'].includes(input.state)) {
         return {
            temperature: 32,
            humidity: 65,
            rainfall: 'Light showers expected in the evening',
        };
    } else if (['Kerala', 'Karnataka', 'Tamil Nadu'].includes(input.state)) {
        return {
            temperature: 28,
            humidity: 80,
            rainfall: 'Heavy rain expected in the next 24 hours',
        };
    }

    return {
      temperature: 30,
      humidity: 75,
      rainfall: 'Partly cloudy with a chance of thunderstorms',
    };
  }
);
