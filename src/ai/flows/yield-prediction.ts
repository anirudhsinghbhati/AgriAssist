'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting crop yields.
 *
 * - yieldPrediction - A function that takes various farm data points and returns a yield prediction.
 * - YieldPredictionInput - The input type for the yieldPrediction function.
 * - YieldPredictionOutput - The return type for the yieldPrediction function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const YieldPredictionInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown (e.g., Soybean, Cotton, Wheat).'),
  landArea: z.coerce.number().describe('The total land area for this crop in hectares.'),
  soilType: z.string().describe('The type of soil (e.g., Alluvial, Black, Red).'),
  plantingDate: z.string().describe('The date the crop was planted in YYYY-MM-DD format.'),
  historicalAverageYield: z.coerce.number().optional().describe('The historical average yield for this crop on this farm in tons per hectare.'),
  weatherForecast: z.string().describe('The seasonal weather forecast (e.g., "Normal Monsoon", "Below-average rainfall expected", "Drought conditions likely").'),
});
export type YieldPredictionInput = z.infer<typeof YieldPredictionInputSchema>;

const YieldPredictionOutputSchema = z.object({
  predictedYield: z.number().describe('The total predicted yield for the entire land area in tons.'),
  yieldPerHectare: z.number().describe('The predicted yield in tons per hectare.'),
  confidenceScore: z.number().describe('A confidence score for the prediction, from 0 to 100.'),
  factors: z.object({
    positive: z.array(z.string()).describe('A list of positive factors influencing the yield.'),
    negative: z.array(z.string()).describe('A list of negative factors or risks influencing the yield.'),
  }),
  recommendations: z.string().describe('A brief set of recommendations to improve or secure the predicted yield.'),
});
export type YieldPredictionOutput = z.infer<typeof YieldPredictionOutputSchema>;

export async function yieldPrediction(input: YieldPredictionInput): Promise<YieldPredictionOutput> {
  return yieldPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yieldPredictionPrompt',
  input: { schema: YieldPredictionInputSchema },
  output: { schema: YieldPredictionOutputSchema },
  prompt: `You are an expert agricultural scientist specializing in crop yield prediction. Based on the data provided, generate a detailed yield prediction for the upcoming harvest.

Farm Data:
- Crop Type: {{{cropType}}}
- Land Area: {{{landArea}}} hectares
- Soil Type: {{{soilType}}}
- Planting Date: {{{plantingDate}}}
- Weather Forecast: {{{weatherForecast}}}
{{#if historicalAverageYield}}- Historical Average Yield: {{{historicalAverageYield}}} tons/hectare{{/if}}

Your task is to:
1.  Calculate the total predicted yield in tons and the yield per hectare.
2.  Provide a confidence score for your prediction (0-100%).
3.  Identify the key positive and negative factors influencing this prediction based on the inputs.
4.  Provide a few concise recommendations to help the farmer maximize or protect their yield.

Strictly follow the output schema.
`,
});

const yieldPredictionFlow = ai.defineFlow(
  {
    name: 'yieldPredictionFlow',
    inputSchema: YieldPredictionInputSchema,
    outputSchema: YieldPredictionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
