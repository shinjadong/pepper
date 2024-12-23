import { create } from 'zustand';
import { Note } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface TrashStore {
  trashedNotes: Note[];
  isLoading: boolean;
  error: string | null;
  moveToTrash: (note: Note) => Promise<void>;
  restoreNote: (noteId: string) => Promise<void>;
  deleteForever: (noteId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  fetchTrashedNotes: () => Promise<void>;
}

const supabaseClient = createClientComponentClient();

export const useTrashStore = create<TrashStore>((set, get) => ({
  trashedNotes: [],
  isLoading: false,
  error: null,

  moveToTrash: async (note) => {
    try {
      set({ isLoading: true });

      // 노트 상태를 'trashed'로 업데이트
      const { error } = await supabaseClient
        .from('notes')
        .update({ status: 'trashed', deleted_at: new Date().toISOString() })
        .eq('id', note.id);

      if (error) throw error;

      // 로컬 상태 업데이트
      set((state) => ({
        trashedNotes: [...state.trashedNotes, { ...note, status: 'trashed' }],
      }));

      toast.success('노트가 휴지통으로 이동되었습니다');
    } catch (error: any) {
      console.error('Failed to move note to trash:', error);
      set({ error: error.message });
      toast.error('노트를 휴지통으로 이동하는데 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  restoreNote: async (noteId) => {
    try {
      set({ isLoading: true });

      // 노트 상태를 'active'로 복원
      const { error } = await supabaseClient
        .from('notes')
        .update({ status: 'active', deleted_at: null })
        .eq('id', noteId);

      if (error) throw error;

      // 로컬 상태 업데이트
      set((state) => ({
        trashedNotes: state.trashedNotes.filter((note) => note.id !== noteId),
      }));

      toast.success('노트가 복원되었습니다');
    } catch (error: any) {
      console.error('Failed to restore note:', error);
      set({ error: error.message });
      toast.error('노트 복원에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteForever: async (noteId) => {
    try {
      set({ isLoading: true });

      // 노트 영구 삭제
      const { error } = await supabaseClient
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // 로컬 상태 업데이트
      set((state) => ({
        trashedNotes: state.trashedNotes.filter((note) => note.id !== noteId),
      }));

      toast.success('노트가 영구적으로 삭제되었습니다');
    } catch (error: any) {
      console.error('Failed to delete note forever:', error);
      set({ error: error.message });
      toast.error('노트 영구 삭제에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  emptyTrash: async () => {
    try {
      set({ isLoading: true });

      // 휴지통의 모든 노트 영구 삭제
      const { error } = await supabaseClient
        .from('notes')
        .delete()
        .eq('status', 'trashed');

      if (error) throw error;

      // 로컬 상태 초기화
      set({ trashedNotes: [] });

      toast.success('휴지통이 비워졌습니다');
    } catch (error: any) {
      console.error('Failed to empty trash:', error);
      set({ error: error.message });
      toast.error('휴지통 비우기에 실패했습니다');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrashedNotes: async () => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabaseClient
        .from('notes')
        .select('*')
        .eq('status', 'trashed')
        .order('deleted_at', { ascending: false });

      if (error) throw error;

      set({ trashedNotes: data });
    } catch (error: any) {
      console.error('Failed to fetch trashed notes:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
