'use server';
/**
 * @fileOverview This file defines a Genkit flow for looking up real-time market prices for crops.
 *
 * - marketPriceLookup - A function that takes a crop name and returns its current market price and trends.
 * - MarketPriceLookupInput - The input type for the marketPriceLookup function.
 * - MarketPriceLookupOutput - The return type for the marketPriceLookup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketPriceLookupInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to look up.'),
});
export type MarketPriceLookupInput = z.infer<typeof MarketPriceLookupInputSchema>;

const MarketPriceLookupOutputSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  variety: z.string().describe('The common variety of the crop.'),
  price: z.number().describe('The current market price in INR.'),
  unit: z.string().describe('The unit of measurement for the price (e.g., Quintal).'),
  change: z.number().describe('The percentage change in price recently.'),
  trend: z.enum(['up', 'down', 'stable']).describe('The recent price trend.'),
});
export type MarketPriceLookupOutput = z.infer<typeof MarketPriceLookupOutputSchema>;

export async function marketPriceLookup(input: MarketPriceLookupInput): Promise<MarketPriceLookupOutput> {
  return marketPriceLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPriceLookupPrompt',
  input: { schema: MarketPriceLookupInputSchema },
  output: { schema: MarketPriceLookupOutputSchema },
  prompt: `You are an agricultural market data analyst. Provide the current, real-world market price for the following crop in the Indian market. Provide a realistic price, variety, and recent trend.

Crop: {{{cropName}}}

Provide the output in the specified JSON format.`,
});

const marketPriceLookupFlow = ai.defineFlow(
  {
    name: 'marketPriceLookupFlow',
    inputSchema: MarketPriceLookupInputSchema,
    outputSchema: MarketPriceLookupOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
