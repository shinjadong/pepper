'use client';

import { useEffect, useState } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { toast } from 'sonner';
import Button from '@/app/components/ui/button';

export function NoteEditForm() {
  const { currentNote, updateNote } = useNoteStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content || '');
    }
  }, [currentNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote) return;

    try {
      await updateNote(currentNote.id, {
        title,
        content,
      });
      toast.success('노트가 저장되었습니다.');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('노트 저장에 실패했습니다.');
    }
  };

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>노트를 선택해주세요</p>
      </div>
    );
  }

  return (
    <form className="flex-1 p-4 flex flex-col h-full" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded px-2"
          placeholder="제목을 입력하세요"
        />
        <Button type="submit" variant="outline" size="sm">
          저장
        </Button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-4 bg-transparent border rounded-lg resize-none focus:ring-2 focus:ring-primary outline-none"
        placeholder="내용을 입력하세요..."
      />
    </form>
  );
}
