import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/types/database';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pageId = formData.get('pageId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 파일 확장자 확인
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      return NextResponse.json(
        { error: 'Invalid file extension' },
        { status: 400 }
      );
    }

    // 이미지 파일 확인
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);
    const bucket = isImage ? 'images' : 'files';

    // 파일 이름 생성 (충돌 방지를 위해 타임스탬프 추가)
    const timestamp = new Date().getTime();
    const fileName = `${pageId}/${timestamp}-${file.name}`;

    // Storage에 파일 업로드
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 파일 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
      type: isImage ? 'image' : 'file',
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
