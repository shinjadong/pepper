'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types';
import { useSupabase } from '@/app/components/providers/supabase-provider';
import { useFolderStore } from '@/app/stores/folder-store';
import { useNoteStore } from '@/app/stores/note-store';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/app/components/ui/button';

export function Notes() {
  const { notes, addNote, setCurrentNote } = useNoteStore();
  const { supabase, session } = useSupabase();
  const { selectedFolder } = useFolderStore();

  const createNote = async () => {
    if (!session?.user?.id || !selectedFolder?.id) return;

    try {
      await addNote({
        title: '새로운 노트',
        content: '',
        folder_id: selectedFolder.id,
        user_id: session.user.id,
      });
      toast.success('노트가 생성되었습니다.');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('노트 생성에 실패했습니다.');
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">노트</h2>
        <Button onClick={createNote} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          새 노트
        </Button>
      </div>
      <div className="grid gap-4">
        {notes
          .filter((note) => note.folder_id === selectedFolder?.id)
          .map((note) => (
            <div
              key={note.id}
              className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setCurrentNote(note)}
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>{note.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
