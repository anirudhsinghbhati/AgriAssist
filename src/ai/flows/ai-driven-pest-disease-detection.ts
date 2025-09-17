'use server';
/**
 * @fileOverview AI-driven pest and disease detection flow. Allows farmers to upload images of crops and receive a diagnosis and treatment suggestions.
 *
 * - aiDrivenPestDiseaseDetection - A function that handles the pest and disease detection process.
 * - AIDrivenPestDiseaseDetectionInput - The input type for the aiDrivenPestDiseaseDetection function.
 * - AIDrivenPestDiseaseDetectionOutput - The return type for the aiDrivenPestDiseaseDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDrivenPestDiseaseDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a potentially diseased crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().optional().describe("The user's preferred language (e.g., 'English', 'Hindi')."),
});
export type AIDrivenPestDiseaseDetectionInput = z.infer<typeof AIDrivenPestDiseaseDetectionInputSchema>;

const AIDrivenPestDiseaseDetectionOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the crop disease or pest.'),
  treatmentSuggestions: z.string().describe('Suggested treatments for the identified disease or pest.'),
});
export type AIDrivenPestDiseaseDetectionOutput = z.infer<typeof AIDrivenPestDiseaseDetectionOutputSchema>;

export async function aiDrivenPestDiseaseDetection(input: AIDrivenPestDiseaseDetectionInput): Promise<AIDrivenPestDiseaseDetectionOutput> {
  return aiDrivenPestDiseaseDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenPestDiseaseDetectionPrompt',
  input: {schema: AIDrivenPestDiseaseDetectionInputSchema},
  output: {schema: AIDrivenPestDiseaseDetectionOutputSchema},
  prompt: `You are an expert in plant pathology. A farmer has provided a photo of a potentially diseased crop. Analyze the image and provide a diagnosis, along with treatment suggestions.

Your entire response must be in the user's preferred language: {{{language}}}.

Photo: {{media url=photoDataUri}}

Diagnosis:
Treatment Suggestions: `,
});

const aiDrivenPestDiseaseDetectionFlow = ai.defineFlow(
  {
    name: 'aiDrivenPestDiseaseDetectionFlow',
    inputSchema: AIDrivenPestDiseaseDetectionInputSchema,
    outputSchema: AIDrivenPestDiseaseDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
