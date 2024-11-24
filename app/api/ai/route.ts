import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { prompt, context, action } = await req.json();

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    let systemPrompt = 'You are a helpful AI assistant for note-taking.';
    
    switch (action) {
      case 'improve':
        systemPrompt += ' Help improve the writing by making it more clear, concise, and professional.';
        break;
      case 'summarize':
        systemPrompt += ' Create a concise summary of the provided text.';
        break;
      case 'expand':
        systemPrompt += ' Expand on the given topic with relevant details and examples.';
        break;
      case 'brainstorm':
        systemPrompt += ' Help brainstorm ideas and generate creative suggestions.';
        break;
      default:
        systemPrompt += ' Provide helpful suggestions and answers.';
    }

    let messages = [
      { role: 'system', content: systemPrompt },
    ] as { role: 'system' | 'user' | 'assistant'; content: string }[];

    if (context) {
      messages.push({
        role: 'user',
        content: `Here is the current context of my note:\n\n${context}`,
      });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: action === 'brainstorm' ? 0.8 : 0.3,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = response.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return new NextResponse(error.message || 'Internal Server Error', {
      status: error.status || 500,
    });
  }
}
