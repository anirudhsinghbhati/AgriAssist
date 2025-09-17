'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating smart irrigation plans.
 *
 * - smartIrrigationPlanner - A function that takes crop and soil data and returns an irrigation recommendation.
 * - SmartIrrigationPlannerInput - The input type for the smartIrrigationPlanner function.
 * - SmartIrrigationPlannerOutput - The return type for the smartIrrigationPlanner function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getRealTimeWeather } from '@/ai/tools/weather';

const SmartIrrigationPlannerInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown (e.g., Soybean, Cotton, Wheat).'),
  cropStage: z.string().describe('The current growth stage of the crop (e.g., Germination, Vegetative, Flowering, Maturity).'),
  soilMoisture: z.coerce.number().describe('The current soil moisture level as a percentage (e.g., 45).'),
  state: z.string().describe('The state where the farm is located.'),
  district: z.string().describe('The district where the farm is located.'),
});
export type SmartIrrigationPlannerInput = z.infer<typeof SmartIrrigationPlannerInputSchema>;

const SmartIrrigationPlannerOutputSchema = z.object({
  irrigationRequired: z.boolean().describe('Whether irrigation is recommended in the next 24 hours.'),
  recommendedAmount: z.number().optional().describe('The recommended amount of water in millimeters (mm). 1mm = 10,000 liters/hectare.'),
  timing: z.string().optional().describe('The best time of day to irrigate (e.g., Early Morning, Late Evening).'),
  reasoning: z.string().describe('A detailed explanation for the recommendation, considering all input factors.'),
});
export type SmartIrrigationPlannerOutput = z.infer<typeof SmartIrrigationPlannerOutputSchema>;

export async function smartIrrigationPlanner(input: SmartIrrigationPlannerInput): Promise<SmartIrrigationPlannerOutput> {
  return smartIrrigationPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartIrrigationPlannerPrompt',
  input: { schema: SmartIrrigationPlannerInputSchema },
  output: { schema: SmartIrrigationPlannerOutputSchema },
  tools: [getRealTimeWeather],
  prompt: `You are an expert agricultural hydrologist specializing in water conservation and crop irrigation. Your task is to provide a smart irrigation recommendation.

First, use the getRealTimeWeather tool to get the current weather conditions for the specified location.

Then, analyze the weather data along with the following farm data to determine if irrigation is necessary:

- Crop Type: {{{cropType}}}
- Current Growth Stage: {{{cropStage}}}
- Soil Moisture: {{{soilMoisture}}}%
- Location: {{{district}}}, {{{state}}}

If irrigation is necessary, recommend the amount of water (in mm, where 1mm equals 10,000 liters per hectare) and the best time of day to irrigate. Provide a clear, concise reasoning for your decision, explaining how the weather, soil moisture, and crop needs influence your recommendation. If no irrigation is needed, explain why (e.g., "due to expected rainfall" or "sufficient soil moisture").

Strictly follow the output schema.`,
});

const smartIrrigationPlannerFlow = ai.defineFlow(
  {
    name: 'smartIrrigationPlannerFlow',
    inputSchema: SmartIrrigationPlannerInputSchema,
    outputSchema: SmartIrrigationPlannerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
