import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {groq} from 'genkitx-groq';

export const ai = genkit({
  plugins: [
    googleAI(),
    groq({
      apiKey: process.env.GROQ_API_KEY || '',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
