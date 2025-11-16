import { NextRequest, NextResponse } from 'next/server';
import { getGroqClient, GROQ_MODELS } from '@/lib/ai/groq-client';
import { buildDMSystemPrompt } from '@/lib/ai/dm-prompts';

export const runtime = 'edge'; // Use edge runtime for faster responses

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, character, gameState } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    const groq = getGroqClient();

    // Build system prompt with character and game context
    const systemPrompt = buildDMSystemPrompt(character, gameState);

    // Prepare messages for Groq
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: GROQ_MODELS.LLAMA_3_1_8B, // Fast model for MVP
      messages: groqMessages as any,
      temperature: 0.8, // Creative but not too random
      max_tokens: 500,  // Keep responses concise
      stream: false,
    });

    const responseMessage = completion.choices[0]?.message?.content || 'The DM remains silent...';

    return NextResponse.json({
      message: responseMessage,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error('Chat API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}
