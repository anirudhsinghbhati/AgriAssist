'use server';
/**
 * @fileOverview This file defines a Genkit flow for voice-assisted app navigation.
 *
 * - voiceAssistedNavigation - A function that takes voice input and returns instructions on how to navigate the app.
 * - VoiceAssistedNavigationInput - The input type for the voiceAssistedNavigation function.
 * - VoiceAssistedNavigationOutput - The return type for the voiceAssistedNavigation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAssistedNavigationInputSchema = z.object({
  voiceInput: z
    .string()
    .describe('The voice input from the user in their local language.'),
  currentScreen: z.string().optional().describe('The current screen the user is on.'),
});
export type VoiceAssistedNavigationInput = z.infer<
  typeof VoiceAssistedNavigationInputSchema
>;

const VoiceAssistedNavigationOutputSchema = z.object({
  navigationInstructions: z
    .string()
    .describe(
      'Instructions on how to navigate the app based on the voice input, in the user\u2019s local language.'
    ),
});
export type VoiceAssistedNavigationOutput = z.infer<
  typeof VoiceAssistedNavigationOutputSchema
>;

export async function voiceAssistedNavigation(
  input: VoiceAssistedNavigationInput
): Promise<VoiceAssistedNavigationOutput> {
  return voiceAssistedNavigationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAssistedNavigationPrompt',
  input: {schema: VoiceAssistedNavigationInputSchema},
  output: {schema: VoiceAssistedNavigationOutputSchema},
  prompt: `You are a voice assistant helping farmers navigate a mobile application using their voice in their local language.

  The user is currently on the {{{currentScreen}}} screen (if provided).

  Based on the user's voice input, provide clear and concise instructions on how to navigate the app to fulfill their request. The instructions should be in the user's local language, and easy to understand for someone with limited literacy.

  Voice Input: {{{voiceInput}}}

  Navigation Instructions:`,
});

const voiceAssistedNavigationFlow = ai.defineFlow(
  {
    name: 'voiceAssistedNavigationFlow',
    inputSchema: VoiceAssistedNavigationInputSchema,
    outputSchema: VoiceAssistedNavigationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
