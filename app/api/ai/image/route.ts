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
    const { prompt, size = '1024x1024' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: size as '1024x1024' | '1792x1024' | '1024x1792',
      quality: 'standard',
      style: 'natural',
    });

    const image = response.data[0];

    // 이미지를 Supabase Storage에 저장
    if (image.url) {
      const imageResponse = await fetch(image.url);
      const blob = await imageResponse.blob();

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('ai-images')
        .upload(fileName, blob);

      if (uploadError) {
        throw uploadError;
      }

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('ai-images')
        .getPublicUrl(fileName);

      return NextResponse.json({ url: publicUrl });
    }

    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  } catch (error) {
    console.error('AI Image Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
