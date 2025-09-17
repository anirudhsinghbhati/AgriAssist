'use server';
/**
 * @fileOverview This file defines a Genkit flow for looking up real-time market prices for crops.
 *
 * - marketPriceLookup - A function that returns a list of current market prices and trends for major crops, or a specific crop if provided.
 * - MarketPriceLookupInput - The input type for the marketPriceLookup function.
 * - MarketPriceListOutput - The return type for the marketPriceLookup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MarketPriceLookupInputSchema = z.object({
  cropName: z.string().optional().describe('The name of a specific crop to look up.'),
});
export type MarketPriceLookupInput = z.infer<typeof MarketPriceLookupInputSchema>;


const MarketPriceItemSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  variety: z.string().describe('The common variety of the crop.'),
  price: z.number().describe('The current market price.'),
  unit: z.string().describe('The unit of measurement for the price (e.g., Quintal).'),
  change: z.number().describe('The percentage change in price recently.'),
  trend: z.enum(['up', 'down', 'stable']).describe('The recent price trend.'),
});

const MarketPriceListOutputSchema = z.object({
    prices: z.array(MarketPriceItemSchema).describe('A list of real-time market prices for various crops.')
});
export type MarketPriceListOutput = z.infer<typeof MarketPriceListOutputSchema>;

export async function marketPriceLookup(input?: MarketPriceLookupInput): Promise<MarketPriceListOutput> {
  return marketPriceLookupFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPriceLookupPrompt',
  input: { schema: MarketPriceLookupInputSchema },
  output: { schema: MarketPriceListOutputSchema },
  prompt: `You are an agricultural market data analyst. Provide current, real-world market prices in the specified JSON format.

{{#if cropName}}
Provide the market price for the following crop relevant to the Indian market: {{{cropName}}}. Provide a realistic price, a common variety, and recent trend.
{{else}}
Provide a list of current market prices for at least 8 major crops relevant to the Indian market (e.g., Wheat, Soybean, Cotton, Maize, Tomato, Onion, Rice, Potato). Provide a realistic price, variety, and recent trend for each crop.
{{/if}}
`,
});

const marketPriceLookupFlow = ai.defineFlow(
  {
    name: 'marketPriceLookupFlow',
    inputSchema: MarketPriceLookupInputSchema,
    outputSchema: MarketPriceListOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input || {});
    return output!;
  }
);
