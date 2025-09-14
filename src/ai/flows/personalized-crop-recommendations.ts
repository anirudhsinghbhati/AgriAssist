'use server';
/**
 * @fileOverview Provides personalized crop recommendations to farmers based on their land, crop choices, and financial constraints.
 *
 * - personalizedCropRecommendations - A function that generates crop recommendations.
 * - PersonalizedCropRecommendationsInput - The input type for the personalizedCropRecommendations function.
 * - PersonalizedCropRecommendationsOutput - The return type for the personalizedCropRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CropDetailSchema = z.object({
  name: z.string().describe('Name of the crop.'),
  expectedYield: z.number().describe('Expected yield in tons per hectare.'),
  sellingPrice: z.number().describe('Selling price per ton.'),
  profitPerHectare: z.number().describe('Profit per hectare.'),
  investmentPerHectare: z.number().describe('Investment required per hectare.'),
  maxAllocation: z.coerce.number().optional().describe('Maximum hectares that can be allocated to this crop.'),
  minAllocation: z.coerce.number().optional().describe('Minimum hectares that must be allocated to this crop.'),
});

const PersonalizedCropRecommendationsInputSchema = z.object({
  totalLand: z.coerce.number().describe('Total available land in hectares.'),
  candidateCrops: z.array(CropDetailSchema).describe('A list of candidate crops with their details.'),
  maxCapital: z.coerce.number().optional().describe('Maximum available capital for investment.'),
  diversification: z.coerce.number().optional().describe('Minimum number of different crops to plant.'),
});

export type PersonalizedCropRecommendationsInput = z.infer<typeof PersonalizedCropRecommendationsInputSchema>;

const RecommendationOptionSchema = z.object({
    crop: z.string().describe("Name of the crop."),
    allocation: z.number().describe("Allocated land in hectares for this crop."),
    investment: z.number().describe("Total investment for this crop based on allocation."),
    expectedProfit: z.number().describe("Expected profit from this crop based on allocation."),
});

const AllocationStrategySchema = z.object({
    strategyName: z.string().describe("Name of the allocation strategy (e.g., 'High Profit Focus', 'Balanced Risk')."),
    description: z.string().describe("A brief description of this strategy."),
    allocations: z.array(RecommendationOptionSchema),
    totalInvestment: z.number().describe("Total investment for this strategy."),
    totalProfit: z.number().describe("Total expected profit for this strategy."),
    roi: z.number().describe("Return on Investment percentage for this strategy."),
});

const PersonalizedCropRecommendationsOutputSchema = z.object({
  recommendations: z.array(AllocationStrategySchema).describe('A list of different crop allocation strategies with their financial details.'),
});
export type PersonalizedCropRecommendationsOutput = z.infer<typeof PersonalizedCropRecommendationsOutputSchema>;


export async function personalizedCropRecommendations(
  input: PersonalizedCropRecommendationsInput
): Promise<PersonalizedCropRecommendationsOutput> {
  return personalizedCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCropRecommendationsPrompt',
  input: { schema: PersonalizedCropRecommendationsInputSchema.extend({
    candidateCropsString: z.string(),
  }) },
  output: { schema: PersonalizedCropRecommendationsOutputSchema },
  prompt: `You are an expert agricultural financial advisor. A farmer needs a decision-support tool to find the most profitable crop or combination of crops for their land.

Here are the inputs provided by the farmer:
- Total available land: {{{totalLand}}} hectares.
- Candidate crops list: {{{candidateCropsString}}}
- Optional: Maximum investment capital: {{{maxCapital}}}
- Optional: Required diversification (minimum number of crops): {{{diversification}}}

Your task is to act as a decision-support system. Use a greedy heuristic to provide different allocation strategies. A greedy heuristic would involve sorting crops by profit/ha and allocating land until the total land is used up, while respecting the constraints.

Please provide approximately 4 different allocation strategies for comparison. For each strategy, provide:
1.  A strategy name (e.g., "Max Profit Strategy", "Balanced Diversification", "Low Investment High ROI").
2.  A brief description of the strategy.
3.  The recommended allocation of land for each crop (in hectares).
4.  The total expected annual profit for that strategy.
5.  The total investment required.
6.  The Return on Investment (ROI) for the strategy.

Ensure the output is in a structured table format that is easy for the farmer to understand and compare the options. The response should strictly follow the output schema.
`,
});

const personalizedCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCropRecommendationsFlow',
    inputSchema: PersonalizedCropRecommendationsInputSchema,
    outputSchema: PersonalizedCropRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      ...input,
      candidateCropsString: JSON.stringify(input.candidateCrops),
    });
    return output!;
  }
);
