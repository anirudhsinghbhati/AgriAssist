// src/ai/flows/personalized-crop-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized crop recommendations to farmers based on their location, soil data, and weather patterns.
 *
 * - personalizedCropRecommendations - A function that generates crop recommendations.
 * - PersonalizedCropRecommendationsInput - The input type for the personalizedCropRecommendations function.
 * - PersonalizedCropRecommendationsOutput - The return type for the personalizedCropRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCropRecommendationsInputSchema = z.object({
  location: z
    .string()
    .describe('The geographical location of the farm (e.g., latitude, longitude, or address).'),
  soilData: z
    .string()
    .describe(
      'The data about the soil composition, pH levels, nutrient content, etc., in a structured format (e.g., JSON).' + 
      'Should include: pH level, nitrogen content (N), phosphorus content (P), and potassium content (K).'
    ),
  weatherData: z
    .string()
    .describe(
      'The current and historical weather data, including temperature, rainfall, humidity, etc., in a structured format (e.g., JSON).' + 
      'Should include: average temperature (Celsius), average rainfall (mm), humidity (%).'
    ),
});

export type PersonalizedCropRecommendationsInput = z.infer<
  typeof PersonalizedCropRecommendationsInputSchema
>;

const PersonalizedCropRecommendationsOutputSchema = z.object({
  cropRecommendations: z
    .string()
    .describe(
      'A list of recommended crops suitable for the given location, soil data, and weather patterns, along with reasons for each recommendation.'
    ),
});

export type PersonalizedCropRecommendationsOutput = z.infer<
  typeof PersonalizedCropRecommendationsOutputSchema
>;

export async function personalizedCropRecommendations(
  input: PersonalizedCropRecommendationsInput
): Promise<PersonalizedCropRecommendationsOutput> {
  return personalizedCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCropRecommendationsPrompt',
  input: {schema: PersonalizedCropRecommendationsInputSchema},
  output: {schema: PersonalizedCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the farmer's location, soil data, and weather patterns, provide personalized crop recommendations.

Location: {{{location}}}
Soil Data: {{{soilData}}}
Weather Data: {{{weatherData}}}

Consider the following factors when making your recommendations:
- Suitability of crops to the local climate
- Soil requirements of different crops
- Market demand for different crops
- Potential yield and profitability of different crops

Format your response as a list of crop recommendations with a brief explanation for each recommendation.
`,
});

const personalizedCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCropRecommendationsFlow',
    inputSchema: PersonalizedCropRecommendationsInputSchema,
    outputSchema: PersonalizedCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
