
'use server';

/**
 * @fileOverview A flow to generate a comprehensive learning path for any given topic.
 *
 * - generateLearningPath - A function that handles the learning path generation.
 * - GenerateLearningPathInput - The input type for the function.
 * - GenerateLearningPathOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLearningPathInputSchema = z.object({
  topic: z.string().describe("The topic the user wants to learn (e.g., 'C++', 'Python', 'React Native')."),
  difficulty: z.string().describe("The desired difficulty for the learning path (e.g., 'Easy', 'Medium', 'Hard')."),
});
export type GenerateLearningPathInput = z.infer<typeof GenerateLearningPathInputSchema>;

const LearningLessonSchema = z.object({
  id: z.string().describe("A unique ID for the lesson (e.g., 'lesson-1-1')."),
  title: z.string().describe('The title of the lesson.'),
  description: z.string().describe('A short, one-sentence description of what this lesson covers.'),
  content: z.string().describe('The detailed, well-structured Markdown content for the lesson. All code snippets must be in fenced code blocks with language identifiers.'),
});

const LearningModuleSchema = z.object({
  id: z.string().describe("A unique ID for the module (e.g., 'module-1-basics')."),
  title: z.string().describe('The title of the learning module.'),
  description: z.string().describe('A short, one-paragraph description of what this module covers.'),
  lessons: z.array(LearningLessonSchema).describe('A list of specific lessons for this module.'),
});

const GenerateLearningPathOutputSchema = z.object({
  title: z.string().describe('The main title of the overall learning path.'),
  introduction: z.string().describe('A short, one-paragraph introduction to the topic.'),
  modules: z.array(LearningModuleSchema).describe('An array of learning modules.'),
  tokensUsed: z.number().optional().describe('The number of tokens used to generate the path.'),
});
export type GenerateLearningPathOutput = z.infer<typeof GenerateLearningPathOutputSchema>;


export async function generateLearningPath(
  input: GenerateLearningPathInput
): Promise<GenerateLearningPathOutput> {
  return generateLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPathPrompt',
  input: { schema: GenerateLearningPathInputSchema },
  output: { schema: GenerateLearningPathOutputSchema },
  prompt: `You are an expert curriculum designer creating a learning path for a given topic.
Your task is to generate a complete, well-structured learning path with modules and detailed lessons.

**Topic:** {{{topic}}}
**Difficulty Level:** {{{difficulty}}}

**Instructions:**
1.  **Structure:** Create a series of modules. Each module should represent a major unit of study.
2.  **Lessons:** Within each module, create several detailed lessons. Each lesson must have a title, a short description, and the full Markdown content for that lesson.
3.  **Content:** The content for each lesson should be comprehensive. Include clear explanations, examples, and all necessary code snippets. **CRITICAL:** All code must be in fenced code blocks with language identifiers.
4.  **Difficulty:** The depth and complexity of the modules and lessons should directly correspond to the requested difficulty level.
    *   **Easy:** Focus on fundamental concepts, simple examples, and getting started.
    *   **Medium:** Introduce more intermediate concepts, more complex examples, and best practices.
    *   **Hard:** Cover advanced topics, complex use cases, performance considerations, and in-depth theory.
5.  **Be Exhaustive:** Do not skip details. Provide complete, ready-to-use content for every single lesson. You are generating the entire course at once.
`,
});

const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: GenerateLearningPathInputSchema,
    outputSchema: GenerateLearningPathOutputSchema,
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
