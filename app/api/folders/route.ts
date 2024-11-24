import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      console.error('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, parentId } = await request.json();

    const { data, error } = await supabase
      .from('folders')
      .insert([
        {
          title,
          user_id: session.user.id,
          parent_id: parentId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating folder:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      console.error('No session found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error getting folders:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return new NextResponse('Session error', { status: 401 });
    }

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    const { data: folder, error } = await supabase
      .from('folders')
      .update({ ...data })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(folder);
  } catch (error: any) {
    console.error('Error updating folder:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return new NextResponse('Session error', { status: 401 });
    }

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Folder ID is required', { status: 400 });
    }

    const { error } = await supabase.from('folders').delete().eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting folder:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}
