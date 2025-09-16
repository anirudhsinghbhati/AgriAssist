
'use server';
/**
 * @fileOverview Provides personalized crop recommendations to farmers based on their location, land, and soil type.
 *
 * - personalizedCropRecommendations - A function that generates crop recommendations.
 * - PersonalizedCropRecommendationsInput - The input type for the personalizedCropRecommendations function.
 * - PersonalizedCropRecommendationsOutput - The return type for the personalizedCropRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedCropRecommendationsInputSchema = z.object({
  totalLand: z.coerce.number().describe('Total available land in hectares.'),
  state: z.string().describe('The state where the farm is located.'),
  district: z.string().describe('The district where the farm is located.'),
  soilType: z.string().describe('The type of soil on the farm (e.g., Alluvial, Black, Red, Loamy).'),
});

export type PersonalizedCropRecommendationsInput = z.infer<typeof PersonalizedCropRecommendationsInputSchema>;

const InvestmentBreakdownSchema = z.object({
  seeds: z.number().describe('Estimated cost for seeds.'),
  machinery: z.number().describe('Estimated cost for machinery usage.'),
  labor: z.number().describe('Estimated cost for labor.'),
  pesticides: z.number().describe('Estimated cost for pesticides and fertilizers.'),
  other: z.number().describe('Other miscellaneous costs.'),
});

const TimelineStepSchema = z.object({
    step: z.string().describe("Name of the activity (e.g., Land Preparation, Planting, Harvesting)."),
    duration: z.string().describe("Estimated duration or timeframe for this step (e.g., '2-3 weeks', 'Mid-June')."),
});

const RiskAnalysisSchema = z.object({
    marketRisk: z.string().describe("Analysis of potential market risks like price volatility."),
    weatherRisk: z.string().describe("Analysis of weather-related risks like drought or heavy rain."),
    pestRisk: z.string().describe("Analysis of common pest and disease risks for the suggested crops."),
});

const RecommendationStrategySchema = z.object({
  strategyName: z.string().describe("Name of the crop strategy (e.g., 'Traditional Cropping', 'High-Value Non-Traditional Farming')."),
  description: z.string().describe("A brief description of this strategy and the crops involved."),
  totalInvestment: z.number().describe("Total estimated investment for this strategy."),
  investmentBreakdown: InvestmentBreakdownSchema.describe("A detailed breakdown of the investment costs."),
  expectedProfit: z.number().describe("Total expected profit for this strategy."),
  roi: z.number().describe("Return on Investment percentage for this strategy."),
  risk: z.string().describe("An overall assessment of the risks involved (e.g., Low, Medium, High)."),
  riskAnalysis: RiskAnalysisSchema.describe("A detailed breakdown of different types of risks."),
  timeline: z.array(TimelineStepSchema).describe("A step-by-step timeline of key farming activities."),
  suggestedCrops: z.string().describe("A comma-separated list of the primary crops in this strategy."),
});

const PersonalizedCropRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationStrategySchema).describe('A list of different crop allocation strategies with their financial details.'),
  extraSuggestions: z.string().optional().describe('Additional notes, suggestions, or considerations for the farmer.'),
});
export type PersonalizedCropRecommendationsOutput = z.infer<typeof PersonalizedCropRecommendationsOutputSchema>;


export async function personalizedCropRecommendations(
  input: PersonalizedCropRecommendationsInput
): Promise<PersonalizedCropRecommendationsOutput> {
  return personalizedCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCropRecommendationsPrompt',
  input: { schema: PersonalizedCropRecommendationsInputSchema },
  output: { schema: PersonalizedCropRecommendationsOutputSchema },
  prompt: `You are an expert agricultural advisor with deep knowledge of Indian farming conditions. A farmer needs a decision-support tool to find the most profitable and suitable crop strategies for their land.

Here are the details provided by the farmer:
- Total available land: {{{totalLand}}} hectares.
- Location: {{{district}}} district, {{{state}}} state.
- Soil Type: {{{soilType}}}.

Your task is to provide at least three distinct and diverse farming strategies tailored to these specific conditions. For each strategy, you must provide a detailed analysis.

The strategies should include:
1.  A Traditional Crop Strategy: Focus on common, stable crops suitable for the region (e.g., staples like wheat, rice, soyabean). This should be a relatively lower-risk option.
2.  A Non-Traditional / High-Value Crop Strategy: Suggest a more specialized, potentially higher-profit crop (e.g., saffron, medicinal herbs, exotic fruits, mushrooms) that is viable in the given location and soil. This might be a higher-risk, higher-reward option.
3.  A Diversified Multi-Crop Strategy: Recommend a mix of crops that can be grown together or in rotation for maximum profit and risk mitigation. This could include vegetables, fruits, medicinal plants, flowers, etc.

For each of these strategies, provide the following details:
- A clear strategy name.
- A description of the strategy and the crops involved.
- A detailed breakdown of the total investment per hectare, including costs for seeds, machinery, labor, pesticides/fertilizers, and other expenses. Calculate the total investment based on the farmer's total land.
- The total expected annual profit.
- The Return on Investment (ROI) for the strategy.
- An overall risk assessment (e.g., Low, Medium, High).
- A detailed risk analysis covering market, weather, and pest risks.
- A step-by-step timeline of key activities (e.g., Land Preparation, Sowing, Irrigation, Harvesting).
- The primary crops suggested in the strategy.

Finally, add any extra suggestions or important notes for the farmer to consider, such as government schemes, market linkages, or modern farming techniques.

Ensure the response strictly follows the output schema.
`,
});

const personalizedCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCropRecommendationsFlow',
    inputSchema: PersonalizedCropRecommendationsInputSchema,
    outputSchema: PersonalizedCropRecommendationsOutputSchema,
    config: {
        retries: 1, // Retry once if the model response is invalid
    },
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
