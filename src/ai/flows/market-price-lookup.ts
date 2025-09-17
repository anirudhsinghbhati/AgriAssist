'use server';
/**
 * @fileOverview This file defines a Genkit flow for looking up real-time market prices for crops.
 *
 * - marketPriceLookup - A function that returns a list of current market prices and trends for major crops.
 * - MarketPriceListOutput - The return type for the marketPriceLookup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketPriceItemSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  variety: z.string().describe('The common variety of the crop.'),
  price: z.number().describe('The current market price in INR.'),
  unit: z.string().describe('The unit of measurement for the price (e.g., Quintal).'),
  change: z.number().describe('The percentage change in price recently.'),
  trend: z.enum(['up', 'down', 'stable']).describe('The recent price trend.'),
});

const MarketPriceListOutputSchema = z.object({
    prices: z.array(MarketPriceItemSchema).describe('A list of real-time market prices for various crops.')
});
export type MarketPriceListOutput = z.infer<typeof MarketPriceListOutputSchema>;

export async function marketPriceLookup(): Promise<MarketPriceListOutput> {
  return marketPriceLookupFlow();
}

const prompt = ai.definePrompt({
  name: 'marketPriceLookupPrompt',
  output: { schema: MarketPriceListOutputSchema },
  prompt: `You are an agricultural market data analyst. Provide a list of current, real-world market prices for at least 8 major crops relevant to the Indian market (e.g., Wheat, Soybean, Cotton, Maize, Tomato, Onion, Rice, Potato). Provide a realistic price, variety, and recent trend for each crop.

Provide the output in the specified JSON format.`,
});

const marketPriceLookupFlow = ai.defineFlow(
  {
    name: 'marketPriceLookupFlow',
    outputSchema: MarketPriceListOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
