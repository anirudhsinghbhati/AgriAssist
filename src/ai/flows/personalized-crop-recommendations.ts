
'use server';
/**
 * @fileOverview Provides personalized crop recommendations to farmers based on their location, land, and soil type.
 * This acts as KrishiMitra AI, an expert agricultural advisor.
 *
 * - personalizedCropRecommendations - A function that generates crop recommendations.
 * - PersonalizedCropRecommendationsInput - The input type for the personalizedCropRecommendations function.
 * - PersonalizedCropRecommendationsOutput - The return type for the personalizedCropRecommendations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getRealTimeWeather } from '@/ai/tools/weather';

const PersonalizedCropRecommendationsInputSchema = z.object({
  totalLand: z.coerce.number().describe('Total available land in hectares.'),
  state: z.string().describe('The state where the farm is located.'),
  district: z.string().describe('The district where the farm is located.'),
  soilType: z.string().describe('The type of soil on the farm (e.g., Alluvial, Black, Red, Loamy).'),
  language: z.string().optional().describe("The user's preferred language (e.g., 'English', 'Hindi')."),
});

export type PersonalizedCropRecommendationsInput = z.infer<typeof PersonalizedCropRecommendationsInputSchema>;

const LocationAndSoilAnalysisSchema = z.object({
    summary: z.string().describe("A brief summary of the farmer's location and soil conditions."),
    soilType: z.string().describe("Identified soil type."),
    suitableCrops: z.array(z.string()).describe("A list of crops generally suitable for this soil and region."),
});

const EconomicsSchema = z.object({
    totalInvestment: z.number().describe("Total estimated investment for this crop strategy."),
    expectedYield: z.string().describe("Expected yield (e.g., '10-12 quintals/hectare')."),
    expectedProfit: z.number().describe("Total expected net profit for this strategy."),
    roi: z.number().describe("Return on Investment percentage for this strategy."),
});

const CultivationStepSchema = z.object({
    month: z.string().describe("The month for the activity (e.g., 'June', 'July-August')."),
    tasks: z.string().describe("A brief description of key tasks for that month."),
});

const RisksAndMitigationSchema = z.object({
    weather: z.string().describe("Potential weather-related risks and how to mitigate them."),
    pest: z.string().describe("Common pest/disease risks and mitigation strategies."),
    market: z.string().describe("Market volatility risks and how to manage them."),
});

const RecommendationStrategySchema = z.object({
  strategyName: z.string().describe("Name of the crop strategy (e.g., 'High-Value Cash Crop')."),
  recommendedCrops: z.string().describe("The primary crop(s) recommended in this strategy."),
  rationale: z.string().describe("Clear reasons why this crop/strategy is recommended for the farmer's specific conditions."),
  economics: EconomicsSchema,
  cultivationCalendar: z.array(CultivationStepSchema).describe("A month-wise calendar of cultivation tasks."),
  risksAndMitigation: RisksAndMitigationSchema,
});

const PersonalizedCropRecommendationsOutputSchema = z.object({
  farmerName: z.string().describe("A familiar way to address the farmer, e.g., 'Kisan Bhai'."),
  locationAndSoilAnalysis: LocationAndSoilAnalysisSchema,
  topCropChoices: z.array(RecommendationStrategySchema).describe('A list of the top 3 recommended crop strategies.'),
  sustainablePractices: z.array(z.string()).describe("A list of recommended sustainable/organic practices."),
  marketStrategy: z.string().describe("General guidance on when and where to sell the produce for best prices."),
  nextActions: z.array(z.string()).describe("A short, numbered list of immediate next steps for the farmer."),
  helplineInfo: z.string().describe("Contact information for local agricultural support or helplines."),
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
  tools: [getRealTimeWeather],
  prompt: `You are KrishiMitra AI, an expert agricultural advisor for small farmers in India. Your goal is to provide clear, actionable, and sustainable crop recommendations.

FARM DETAILS:
- Farm Size: {{{totalLand}}} hectares
- Location: {{{district}}}, {{{state}}}
- Soil Type: {{{soilType}}}
- Preferred Language: {{{language}}}

INSTRUCTIONS:
1.  First, call the getRealTimeWeather tool to fetch the current weather conditions for the farmer's location.
2.  Analyze the provided farm details AND the real-time weather data.
3.  Suggest the TOP 3 diverse and practical crop strategies for the upcoming main season (assume Kharif if not specified).
4.  For each strategy, provide a detailed breakdown covering rationale, economics, a cultivation calendar, risks, and mitigation.
5.  Use realistic yield and financial data for the specified Indian location.
6.  Incorporate the weather data into your risk analysis and recommendations.
7.  Include advice on sustainable practices and market strategy.
8.  Conclude with clear, simple next steps and a helpline.
9.  The response must be in the user's Preferred Language (e.g., 'English' or 'Hindi').
10. Strictly adhere to the output JSON schema.

Begin the analysis now and generate the structured recommendation.
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
