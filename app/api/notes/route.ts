import { NextResponse } from 'next/server';
import { NoteService } from '@/app/services/notes/NoteService';
import { getSession } from '@/app/lib/session';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const note = await NoteService.create({
      ...body,
      user_id: session.user.id,
    });

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error creating note:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const id = searchParams.get('id');

    if (id) {
      const note = await NoteService.getById(id);
      return NextResponse.json(note);
    }

    if (folderId) {
      const notes = await NoteService.getByFolderId(folderId);
      return NextResponse.json(notes);
    }

    const notes = await NoteService.getAllByUserId(session.user.id);
    return NextResponse.json(notes);
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;
    const note = await NoteService.update(id, data);

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error updating note:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Note ID is required', { status: 400 });
    }

    await NoteService.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}
