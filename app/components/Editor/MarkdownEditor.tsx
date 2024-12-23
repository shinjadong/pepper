'use client';

import { useCallback, useEffect, useState } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { useDebounce } from '@/hooks/use-debounce';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useSupabase } from '@/app/components/providers/supabase-provider';
import { AIAssistant } from '../ai/AIAssistant';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export function MarkdownEditor() {
  const { theme } = useTheme();
  const currentNote = useNoteStore((state) => state.currentNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const [content, setContent] = useState(currentNote?.content || '');
  const debouncedContent = useDebounce(content, 1000);
  const { supabase } = useSupabase();

  useEffect(() => {
    setContent(currentNote?.content || '');
  }, [currentNote?.id]);

  useEffect(() => {
    if (currentNote && debouncedContent !== currentNote.content) {
      updateNote(currentNote.id, { content: debouncedContent });
    }
  }, [debouncedContent, currentNote, updateNote]);

  const handleChange = useCallback((value?: string) => {
    setContent(value || '');
  }, []);

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a note to start editing
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" data-color-mode={theme}>
      <div className="flex-1 overflow-auto">
        <MDEditor
          value={content}
          onChange={handleChange}
          preview="edit"
          hideToolbar={false}
          height="100%"
          visibleDragbar={false}
          className="w-full h-full border-none"
          textareaProps={{
            placeholder: 'Start writing...',
          }}
        />
      </div>
      <AIAssistant content={content} />
    </div>
  );
}
