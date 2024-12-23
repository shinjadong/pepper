'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  folderId: string;
}

export function NotesList({ folderId }: { folderId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <Link
          key={note.id}
          href={`/notes/edit/${note.id}`}
          className="block p-2 hover:bg-zinc-700 rounded"
        >
          {note.title || 'Untitled Note'}
        </Link>
      ))}
      <button className="w-full p-2 text-left hover:bg-zinc-700 rounded">+ New Note</button>
    </div>
  );
}
