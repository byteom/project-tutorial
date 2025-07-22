'use server';

/**
 * @fileOverview Personalized assistance flow to provide adaptive learning support.
 *
 * - getPersonalizedAssistance - A function that triggers personalized help based on user struggle.
 * - PersonalizedAssistanceInput - The input type for the getPersonalizedAssistance function.
 * - PersonalizedAssistanceOutput - The return type for the getPersonalizedAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {groq} from 'genkitx-groq';


const PersonalizedAssistanceInputSchema = z.object({
  tutorialStep: z
    .string()
    .describe('The current step in the tutorial the user is on.'),
  userProgress: z
    .string()
    .describe(
      'Description of the users progress on the current step, including any errors or challenges they are facing.'
    ),
  groqApiKey: z.string().describe('The users Groq API key.'),
});
export type PersonalizedAssistanceInput = z.infer<
  typeof PersonalizedAssistanceInputSchema
>;

const PersonalizedAssistanceOutputSchema = z.object({
  assistanceMessage: z
    .string()
    .describe(
      'A helpful message providing guidance and support to the user based on their described struggle.'
    ),
});
export type PersonalizedAssistanceOutput = z.infer<
  typeof PersonalizedAssistanceOutputSchema
>;

export async function getPersonalizedAssistance(
  input: PersonalizedAssistanceInput
): Promise<PersonalizedAssistanceOutput> {
  return personalizedAssistanceFlow(input);
}

const personalizedAssistanceFlow = ai.defineFlow(
  {
    name: 'personalizedAssistanceFlow',
    inputSchema: PersonalizedAssistanceInputSchema,
    outputSchema: PersonalizedAssistanceOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      prompt: `You are an AI assistant designed to provide personalized assistance to users working through a tutorial.

      The user is currently on step: ${input.tutorialStep}
      They are struggling with the following:
      ${input.userProgress}
    
      Provide a helpful message that guides them towards resolving their issue and continuing with the tutorial.
      Your message should be encouraging and supportive.`,
      config: {
        apiKey: input.groqApiKey || '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',
      },
    });

    return {assistanceMessage: output!.text!};
  }
);
