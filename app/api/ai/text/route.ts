import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { prompt, context } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 컨텍스트가 있는 경우 프롬프트에 추가
    const fullPrompt = context
      ? `Context:\n${context}\n\nPrompt: ${prompt}`
      : prompt;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            '당신은 사용자의 글쓰기를 도와주는 AI 어시스턴트입니다. 주어진 컨텍스트를 바탕으로 자연스럽고 명확한 텍스트를 생성해주세요.',
        },
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI Text Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}
