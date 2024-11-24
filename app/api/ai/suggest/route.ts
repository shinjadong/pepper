import { NextResponse } from 'next/server';
import { AIService } from '@/app/services/ai/AIService';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 세션 체크
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, type = 'suggestion', noteContent } = body;

    if (!prompt && !noteContent) {
      return NextResponse.json({ error: 'Prompt or note content is required' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'enhance':
        result = await AIService.enhanceNote(noteContent);
        break;
      case 'tags':
        result = await AIService.suggestTags(noteContent);
        break;
      case 'analyze':
        result = await AIService.analyzeNote(noteContent);
        break;
      default:
        result = await AIService.generateSuggestion(prompt);
    }

    return NextResponse.json({ content: result });
  } catch (error: any) {
    console.error('Error in AI route:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.message?.includes('not configured')) {
      return NextResponse.json({ error: 'AI service is not configured properly' }, { status: 503 });
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
}
