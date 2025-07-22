
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
    .describe('The content and instructions for the current tutorial step the user is on.'),
  userProgress: z
    .string()
    .describe(
      'The user\'s specific question or a description of the error they are facing.'
    ),
    userCode: z.optional(z.string()).describe("The code the user has written. If the user's question is about an error, analyze this code to provide a specific, contextual answer.")
});
export type PersonalizedAssistanceInput = z.infer<
  typeof PersonalizedAssistanceInputSchema
>;

const PersonalizedAssistanceOutputSchema = z.object({
  assistanceMessage: z
    .string()
    .describe(
      'A helpful message formatted in Markdown that provides guidance and support to the user based on their question and the tutorial context.'
    ),
  tokensUsed: z.number().optional().describe('The number of tokens used for this assistance.'),
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
    prompt: `You are an expert AI teaching assistant for a software development learning platform.
Your goal is to provide clear, concise, and encouraging help to users who are stuck on a specific task.

**CONTEXT:**
The user is working on the following tutorial task:
---
{{tutorialStep}}
---

**USER'S QUESTION/PROBLEM:**
---
"{{userProgress}}"
---
{{#if userCode}}
**USER'S CODE:**
---
\`\`\`
{{userCode}}
\`\`\`
---
**INSTRUCTIONS:**
1.  **Analyze the Context:** Carefully read the user's question, their code, and the provided tutorial context.
2.  **Provide a Direct Answer:** Directly address the user's question or problem. If they provided code with an error, identify the specific error in their code.
3.  **Explain the "Why":** Don't just give the answer. Explain *why* the error is occurring and what concept they might be misunderstanding.
4.  **Guide, Don't Solve:** Guide the user toward the correct solution. Provide corrected code snippets, but avoid giving away the complete solution for the entire task.
5.  **Use Markdown:** Format your response for readability (e.g., use code fences for code, bold for emphasis).
6.  **Be Encouraging:** Maintain a positive and supportive tone. Remind the user that getting stuck is a normal part of learning.
{{else}}
**INSTRUCTIONS:**
1.  **Analyze the Context:** Carefully read the user's question and the provided tutorial context.
2.  **Provide a Direct Answer:** Directly address the user's question or problem.
3.  **Use Markdown:** Format your response using Markdown for readability (e.g., use code fences for code, bold for emphasis, and lists for steps).
4.  **Be Encouraging:** Maintain a positive and supportive tone. Remind the user that getting stuck is a normal part of learning.
5.  **Do Not Give the Full Answer:** Do not just give away the complete solution. Guide the user toward finding the solution themselves. Provide hints, suggest what to look for, or explain the relevant concept.
{{/if}}
`,
});


const personalizedAssistanceFlow = ai.defineFlow(
    {
        name: 'personalizedAssistanceFlow',
        inputSchema: PersonalizedAssistanceInputSchema,
        outputSchema: PersonalizedAssistanceOutputSchema,
    },
    async (input) => {
        const result = await prompt(input);
        const usage = result.usage;
        const tokensUsed = (usage?.inputTokens || 0) + (usage?.outputTokens || 0);

        return {
          assistanceMessage: result.output!.assistanceMessage,
          tokensUsed: tokensUsed,
        };
    }
);
