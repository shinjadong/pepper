import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    let blocksQuery = supabase
      .from('blocks')
      .select('*, pages!inner(*)')
      .or(`content->>'text'.ilike.%${query}%, pages.title.ilike.%${query}%`);

    // 타입별 필터링
    if (type !== 'all') {
      blocksQuery = blocksQuery.eq('type', type);
    }

    const { data: blocks, error } = await blocksQuery.limit(20);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 검색 결과 가공
    const results = blocks.map((block) => {
      const page = block.pages as any;
      const preview = block.content.text as string || '';
      
      // 검색어 하이라이트를 위한 미리보기 생성
      const startIndex = preview.toLowerCase().indexOf(query.toLowerCase());
      let highlightedPreview = preview;
      
      if (startIndex !== -1) {
        const endIndex = startIndex + query.length;
        const before = preview.slice(Math.max(0, startIndex - 50), startIndex);
        const match = preview.slice(startIndex, endIndex);
        const after = preview.slice(endIndex, endIndex + 50);
        
        highlightedPreview = `...${before}<mark>${match}</mark>${after}...`;
      }

      return {
        id: block.id,
        type: block.type,
        preview: highlightedPreview,
        page: {
          id: page.id,
          title: page.title,
          icon: page.icon,
        },
        created_at: block.created_at,
      };
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
