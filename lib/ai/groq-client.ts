import Groq from 'groq-sdk';

// Initialize Groq client
let groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    groqClient = new Groq({
      apiKey,
    });
  }

  return groqClient;
}

// Available models on Groq free tier
export const GROQ_MODELS = {
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile', // Best quality, slower
  LLAMA_3_1_8B: 'llama-3.1-8b-instant',     // Faster, good quality
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',       // Good for creative writing
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];
