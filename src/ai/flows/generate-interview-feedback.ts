
'use server';

/**
 * @fileOverview A flow to generate feedback on an interview answer, including audio analysis.
 *
 * - generateInterviewFeedback - A function that handles the feedback generation.
 * - GenerateInterviewFeedbackInput - The input type for the function.
 * - GenerateInterviewFeedbackOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewFeedbackInputSchema = z.object({
  question: z.string().describe("The interview question that was asked."),
  answerAudio: z.string().describe("The user's answer recorded as an audio data URI."),
});
export type GenerateInterviewFeedbackInput = z.infer<typeof GenerateInterviewFeedbackInputSchema>;

const AnalysisCriteriaSchema = z.object({
  rating: z.string().describe("The rating for this criterion (e.g., 'Needs Improvement', 'Average', 'Good', 'Excellent')."),
  reason: z.string().describe("A brief, one-sentence justification for the rating."),
});

const GenerateInterviewFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, constructive feedback on the user\'s answer, formatted in Markdown. It should analyze the answer\'s structure, clarity, and content, and provide specific suggestions for improvement.'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing the overall quality of the answer, considering both content and delivery.'),
  transcript: z.string().describe("The full transcript of the user's spoken answer."),
  analysis: z.object({
    clarity: AnalysisCriteriaSchema.describe("How clear and easy to understand the answer was."),
    relevance: AnalysisCriteriaSchema.describe("How well the answer addressed the question."),
    fillerWords: AnalysisCriteriaSchema.describe("Analysis of the use of filler words like 'um', 'ah', 'like'. A lower frequency is better."),
    pacing: AnalysisCriteriaSchema.describe("Analysis of the speaking pace. Was it too fast, too slow, or just right?"),
    confidence: AnalysisCriteriaSchema.describe("Analysis of the perceived confidence based on tone and speech patterns."),
  }).describe('A detailed analysis of the user\'s answer across multiple criteria.'),
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
  prompt: `You are a world-class interview and speech coach. Your task is to provide high-quality, constructive feedback on a user's spoken answer to an interview question. You will receive an audio file of the user's response.

**Interview Question:**
---
{{{question}}}
---

**User's Spoken Answer (Audio):**
---
{{media url=answerAudio}}
---

**Instructions:**
1.  **Transcribe the Audio:** First, accurately transcribe the user's spoken answer from the audio file. The full transcript must be included in the 'transcript' output field.
2.  **Analyze the Content (from Transcript):** Based on your transcription, evaluate the substance of the answer.
    *   **Clarity:** Is the answer well-organized, logical, and easy to follow?
    *   **Relevance:** Does the answer directly and effectively address the question asked?
3.  **Analyze the Delivery (from Audio):** Listen to the audio to evaluate the user's delivery.
    *   **Filler Words:** Identify the frequency and impact of filler words (e.g., "um," "ah," "uh," "like," "you know"). A great answer has very few.
    *   **Pacing:** Was the speaking pace appropriate? Was it too fast, making it hard to follow? Or too slow, sounding hesitant?
    *   **Confidence:** Assess the user's confidence from their tone, pace, and avoidance of hesitation.
4.  **Provide Structured Analysis:** For each of the analysis criteria (Clarity, Relevance, Filler Words, Pacing, Confidence), provide a rating ('Needs Improvement', 'Average', 'Good', 'Excellent') and a brief, one-sentence reason for that rating.
5.  **Provide Detailed Feedback:** Write comprehensive feedback in Markdown format. Be encouraging and actionable.
    *   Start with a positive point about their content or delivery.
    *   Identify specific areas for improvement, quoting from the transcript where helpful.
    *   Provide concrete examples of how the user could rephrase parts of their answer or improve their delivery.
6.  **Assign a Score:** Give an overall score from 0 to 100, considering both the content of the answer and the quality of the delivery.
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
