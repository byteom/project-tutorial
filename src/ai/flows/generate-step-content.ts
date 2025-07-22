
'use server';

/**
 * @fileOverview A flow to generate the detailed content for a single tutorial sub-task.
 *
 * - generateStepContent - A function that handles content generation for a specific sub-task.
 * - GenerateStepContentInput - The input type for the function.
 * - GenerateStepContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateStepContentInputSchema = z.object({
  projectTitle: z.string().describe('The main title of the overall tutorial.'),
  stepTitle: z.string().describe('The title of the current high-level step.'),
  subTaskTitle: z.string().describe('The title of the specific sub-task to generate content for.'),
  subTaskDescription: z.string().describe('The one-sentence description of the sub-task.'),
  fullOutline: z.string().describe('The full outline of the entire tutorial for context.'),
});
export type GenerateStepContentInput = z.infer<typeof GenerateStepContentInputSchema>;

const GenerateStepContentOutputSchema = z.object({
  content: z.string().describe('The detailed, well-structured Markdown content for the sub-task. All code snippets must be in fenced code blocks with language identifiers.'),
});
export type GenerateStepContentOutput = z.infer<typeof GenerateStepContentOutputSchema>;


export async function generateStepContent(
  input: GenerateStepContentInput
): Promise<GenerateStepContentOutput> {
  return generateStepContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStepContentPrompt',
  input: { schema: GenerateStepContentInputSchema },
  output: { schema: GenerateStepContentOutputSchema },
  prompt: `You are an expert technical writer creating content for a software development tutorial.
Your task is to generate the detailed content for a single sub-task within a larger project.

**Project Context:**
- **Project Title:** {{{projectTitle}}}
- **Full Tutorial Outline:**
{{{fullOutline}}}

**Current Task:**
- **Step:** {{{stepTitle}}}
- **Sub-Task:** {{{subTaskTitle}}}
- **Description:** {{{subTaskDescription}}}

**Instructions:**
1.  Generate comprehensive, easy-to-follow content for the specified sub-task.
2.  Provide clear explanations of the concepts involved.
3.  Include all necessary code snippets for this sub-task.
4.  **CRITICAL:** All code snippets must be enclosed in fenced code blocks with the appropriate language identifier (e.g., \`\`\`javascript or \`\`\`bash). Do not include the filename inside the code block fence.
5.  Format the response using Markdown for headings, lists, and inline code.
6.  Focus ONLY on the current sub-task. Do not include content from other sub-tasks.
`,
});

const generateStepContentFlow = ai.defineFlow(
  {
    name: 'generateStepContentFlow',
    inputSchema: GenerateStepContentInputSchema,
    outputSchema: GenerateStepContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
