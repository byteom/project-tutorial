
'use server';

/**
 * @fileOverview A flow to generate feedback on an interview answer.
 *
 * - generateInterviewFeedback - A function that handles the feedback generation.
 * - GenerateInterviewFeedbackInput - The input type for the function.
 * - GenerateInterviewFeedbackOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewFeedbackInputSchema = z.object({
  question: z.string().describe("The interview question that was asked."),
  answer: z.string().describe("The user's answer to the question."),
});
export type GenerateInterviewFeedbackInput = z.infer<typeof GenerateInterviewFeedbackInputSchema>;

const GenerateInterviewFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, constructive feedback on the user\'s answer, formatted in Markdown. It should analyze the answer\'s structure, clarity, and content, and provide specific suggestions for improvement.'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing the quality of the answer.'),
  tokensUsed: z.number().optional().describe('The number of tokens used to generate the feedback.'),
});
export type GenerateInterviewFeedbackOutput = z.infer<typeof GenerateInterviewFeedbackOutputSchema>;


export async function generateInterviewFeedback(
  input: GenerateInterviewFeedbackInput
): Promise<GenerateInterviewFeedbackOutput> {
  return generateInterviewFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewFeedbackPrompt',
  input: { schema: GenerateInterviewFeedbackInputSchema },
  output: { schema: GenerateInterviewFeedbackOutputSchema },
  prompt: `You are an expert career coach and interview trainer. Your task is to provide high-quality, constructive feedback on a user's answer to an interview question.

**Interview Question:**
---
{{{question}}}
---

**User's Answer:**
---
{{{answer}}}
---

**Instructions:**
1.  **Analyze the Answer:** Carefully evaluate the user's answer based on the following criteria:
    *   **Clarity and Structure:** Is the answer well-organized and easy to follow? Does it use a clear structure (like the STAR method for behavioral questions)?
    *   **Relevance:** Does the answer directly address the question?
    *   **Completeness:** Does the answer provide sufficient detail and examples?
    *   **Impact:** Does the answer effectively demonstrate the user's skills and accomplishments?
2.  **Provide Constructive Feedback:** Write detailed feedback in Markdown format. The feedback should be encouraging and actionable.
    *   Start with a positive point.
    *   Identify specific areas for improvement.
    *   Provide concrete examples of how the user could rephrase or restructure parts of their answer.
    *   Offer a revised, improved version of the answer as an example.
3.  **Assign a Score:** Give a score from 0 to 100 that reflects the overall quality of the user's answer.
`,
});

const generateInterviewFeedbackFlow = ai.defineFlow(
  {
    name: 'generateInterviewFeedbackFlow',
    inputSchema: GenerateInterviewFeedbackInputSchema,
    outputSchema: GenerateInterviewFeedbackOutputSchema,
  },
  async (input) => {
    const result = await prompt(input);
    const usage = result.usage;
    const tokensUsed = (usage?.inputTokens || 0) + (usage?.outputTokens || 0);
    return {
      ...result.output!,
      tokensUsed: tokensUsed,
    };
  }
);
