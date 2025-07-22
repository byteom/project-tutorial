'use server';

/**
 * @fileOverview Personalized assistance flow to provide adaptive learning support.
 *
 * - getPersonalizedAssistance - A function that triggers personalized help based on user struggle.
 * - PersonalizedAssistanceInput - The input type for the getPersonalizedAssistance function.
 * - PersonalizedAssistanceOutput - The return type for the getPersonalizedAssistance function.
 */
import { ai } from '@/ai/genkit';
import {z} from 'zod';

const PersonalizedAssistanceInputSchema = z.object({
  tutorialStep: z
    .string()
    .describe('The current step in the tutorial the user is on.'),
  userProgress: z
    .string()
    .describe(
      'Description of the users progress on the current step, including any errors or challenges they are facing.'
    ),
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

const prompt = ai.definePrompt({
    name: 'personalizedAssistancePrompt',
    input: { schema: PersonalizedAssistanceInputSchema },
    output: { schema: PersonalizedAssistanceOutputSchema },
    prompt: `You are an AI assistant designed to provide personalized assistance to users working through a tutorial.

The user is currently on step: "{{tutorialStep}}"
They are struggling with the following:
"{{userProgress}}"

Provide a helpful message that guides them towards resolving their issue and continuing with the tutorial.
Your message should be encouraging and supportive.`,
});


const personalizedAssistanceFlow = ai.defineFlow(
    {
        name: 'personalizedAssistanceFlow',
        inputSchema: PersonalizedAssistanceInputSchema,
        outputSchema: PersonalizedAssistanceOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
