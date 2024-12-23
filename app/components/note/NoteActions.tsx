'use client';

import { useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal, Copy, Scissors, Trash } from 'lucide-react';
import { Note } from '../../types';
import { useClipboardStore } from '../../stores/clipboard-store';
import { useNoteStore } from '../../stores/note-store';
import { useFolderStore } from '../../stores/folder-store';
import { toast } from 'sonner';
import { useDrag } from 'react-dnd';
import { FileIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NoteActionsProps {
  note: Note;
  isActive?: boolean;
  className?: string;
}

export function NoteActions({ note, isActive, className }: NoteActionsProps) {
  const { copyNote, cutNote } = useClipboardStore();
  const { deleteNote } = useNoteStore();

  const handleCopy = useCallback(() => {
    if (!note) return;
    copyNote(note);
  }, [copyNote, note]);

  const handleCut = useCallback(() => {
    if (!note) return;
    cutNote(note);
  }, [cutNote, note]);

  const handleDelete = useCallback(async () => {
    if (!note || !confirm('정말로 이 노트를 삭제하시겠습니까?')) return;
    
    try {
      await deleteNote(note.id);
      toast.success('노트가 삭제되었습니다');
    } catch (error) {
      toast.error('노트 삭제 실패');
    }
  }, [deleteNote, note]);

  const [{ isDragging }, drag] = useDrag({
    type: 'NOTE',
    item: { id: note.id, type: 'NOTE' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case 'c':
            if (!note) return;
            copyNote(note);
            break;
          case 'x':
            if (!note) return;
            cutNote(note);
            break;
        }
      }
    },
    [note, copyNote, cutNote]
  );

  return (
    <div
      ref={drag}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex cursor-move items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent',
        {
          'bg-accent': isActive,
          'opacity-50': isDragging,
        },
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">노트 메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            복사
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCut}>
            <Scissors className="mr-2 h-4 w-4" />
            잘라내기
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FileIcon className="h-4 w-4 shrink-0" />
      <span className="truncate">{note?.title}</span>
    </div>
  );
}
