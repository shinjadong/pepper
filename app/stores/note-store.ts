import { create } from 'zustand';
import { supabaseClient } from '../lib/supabase';
import { Note } from '@/types';
import { toast } from 'sonner';

interface NoteStore {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;
  fetchNotes: () => Promise<void>;
  moveNote: (noteId: string, targetFolderId: string | null) => Promise<void>;
  toggleFavorite: (noteId: string) => Promise<void>;
  moveToTrash: (noteId: string) => Promise<void>;
  restoreFromTrash: (noteId: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  setupRealtime: () => () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  setNotes: (notes) => set({ notes }),
  setCurrentNote: (note) => set({ currentNote: note }),

  fetchNotes: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ notes: data || [] });
    } catch (error: any) {
      console.error('Failed to fetch notes:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (note) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        notes: [data, ...state.notes],
        currentNote: data,
      }));
    } catch (error: any) {
      console.error('Failed to add note:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (noteId, updates) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('notes')
        .update(updates)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, ...updates } : note
        ),
        currentNote:
          state.currentNote?.id === noteId
            ? { ...state.currentNote, ...updates }
            : state.currentNote,
      }));
    } catch (error: any) {
      console.error('Failed to update note:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (noteId) => {
    try {
      set({ isLoading: true });
      const { error } = await supabaseClient
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
      }));
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  moveNote: async (noteId, targetFolderId) => {
    try {
      const { error } = await supabaseClient
        .from('notes')
        .update({ folder_id: targetFolderId })
        .eq('id', noteId);

      if (error) throw error;

      // Update local state
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, folder_id: targetFolderId } : note
        ),
      }));
    } catch (error) {
      console.error('Error moving note:', error);
      throw error;
    }
  },

  toggleFavorite: async (noteId) => {
    try {
      const note = get().notes.find((n) => n.id === noteId);
      if (!note) return;

      const newValue = !note.is_favorite;
      await get().updateNote(noteId, { is_favorite: newValue });
      toast.success(
        newValue ? '즐겨찾기에 추가되었습니다' : '즐겨찾기가 해제되었습니다'
      );
    } catch (error) {
      toast.error('즐겨찾기 설정에 실패했습니다');
      throw error;
    }
  },

  moveToTrash: async (noteId) => {
    try {
      await get().updateNote(noteId, {
        is_trashed: true,
        trashed_at: new Date().toISOString(),
      });
      toast.success('노트가 휴지통으로 이동되었습니다');
    } catch (error) {
      toast.error('노트 삭제에 실패했습니다');
      throw error;
    }
  },

  restoreFromTrash: async (noteId) => {
    try {
      await get().updateNote(noteId, {
        is_trashed: false,
        trashed_at: null,
      });
      toast.success('노트가 복원되었습니다');
    } catch (error) {
      toast.error('노트 복원에 실패했습니다');
      throw error;
    }
  },

  emptyTrash: async () => {
    try {
      set({ isLoading: true });
      const { error } = await supabaseClient
        .from('notes')
        .delete()
        .eq('is_trashed', true);

      if (error) throw error;
      set((state) => ({
        notes: state.notes.filter((note) => !note.is_trashed),
      }));
      toast.success('휴지통이 비워졌습니다');
    } catch (error: any) {
      console.error('Failed to empty trash:', error);
      set({ error: error.message });
      toast.error('휴지통 비우기에 실패했습니다');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setupRealtime: () => {
    const subscription = supabaseClient
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          const store = get();

          switch (eventType) {
            case 'INSERT':
              set({ notes: [newRecord as Note, ...store.notes] });
              break;
            case 'UPDATE':
              set({
                notes: store.notes.map((note) =>
                  note.id === newRecord.id ? { ...note, ...newRecord } : note
                ),
                currentNote:
                  store.currentNote?.id === newRecord.id
                    ? { ...store.currentNote, ...newRecord }
                    : store.currentNote,
              });
              break;
            case 'DELETE':
              set({
                notes: store.notes.filter((note) => note.id !== oldRecord.id),
                currentNote:
                  store.currentNote?.id === oldRecord.id
                    ? null
                    : store.currentNote,
              });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));
