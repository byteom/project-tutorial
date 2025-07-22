
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
Your primary goal is to provide adaptive, Socratic guidance to users who are stuck. You do not just give away answers. Instead, you help users learn by identifying the root of their misunderstanding and providing a focused "mini-task" or explanation to bridge the knowledge gap.

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
{{/if}}

**INSTRUCTIONS:**
1.  **Analyze the Root Cause:** Carefully read the user's question, their code (if provided), and the tutorial context. Identify the core concept or fundamental knowledge the user is missing. (e.g., Are they misunderstanding props? Is it an async/await issue? Do they not grasp a specific CSS concept?).
2.  **Frame as a Mini-Task or Explanation:** Based on your analysis, generate a response that directly addresses the user's misunderstanding.
    *   **If it's a conceptual gap:** Provide a clear, concise explanation of the core concept. Use an analogy or a simplified example. Start with a title like \`### Mini-Task: Understanding React Props\`.
    *   **If it's a code error:** Pinpoint the error in their code. Explain *why* it's an error based on the underlying principles. Provide a corrected snippet, but also explain the fix. Frame it like \`### Let's Fix That Error!\`.
3.  **Use Markdown:** Format your response for readability (e.g., use headings for your mini-task, code fences for code, bold for emphasis).
4.  **Be Encouraging:** Maintain a positive and supportive tone. Remind the user that getting stuck is a normal and essential part of the learning process.
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
