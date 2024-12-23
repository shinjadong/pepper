import { create } from 'zustand';
import { Note } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface ClipboardStore {
  copiedNote: Note | null;
  isCutting: boolean;
  copyNote: (note: Note) => void;
  cutNote: (note: Note) => void;
  pasteNote: (targetFolderId: string | null) => Promise<void>;
  clear: () => void;
}

const supabaseClient = createClientComponentClient();

export const useClipboardStore = create<ClipboardStore>((set, get) => ({
  copiedNote: null,
  isCutting: false,

  copyNote: (note) => {
    set({ copiedNote: note, isCutting: false });
    toast.success('노트가 복사되었습니다');
  },

  cutNote: (note) => {
    set({ copiedNote: note, isCutting: true });
    toast.success('노트가 잘라내기되었습니다');
  },

  pasteNote: async (targetFolderId) => {
    const { copiedNote, isCutting } = get();
    if (!copiedNote) return;

    try {
      if (isCutting) {
        // 잘라내기인 경우 노트 이동
        const { error } = await supabaseClient
          .from('notes')
          .update({ folder_id: targetFolderId })
          .eq('id', copiedNote.id);

        if (error) throw error;
        toast.success('노트가 이동되었습니다');
      } else {
        // 복사인 경우 새 노트 생성
        const newNote = {
          ...copiedNote,
          id: undefined,
          folder_id: targetFolderId,
          title: `${copiedNote.title} (복사본)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabaseClient
          .from('notes')
          .insert(newNote);

        if (error) throw error;
        toast.success('노트가 복사되었습니다');
      }

      // 잘라내기였다면 클립보드 초기화
      if (isCutting) {
        set({ copiedNote: null, isCutting: false });
      }
    } catch (error: any) {
      console.error('Failed to paste note:', error);
      toast.error('노트 붙여넣기 실패');
    }
  },

  clear: () => {
    set({ copiedNote: null, isCutting: false });
  },
}));
