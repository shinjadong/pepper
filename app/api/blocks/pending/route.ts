import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 동기화되지 않은 블록 조회
    const { data: pendingBlocks, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('sync_status', 'pending');

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: pendingBlocks });
  } catch (error) {
    console.error('Error fetching pending blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending blocks' },
      { status: 500 }
    );
  }
}
