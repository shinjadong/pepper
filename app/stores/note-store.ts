import { create } from 'zustand';
import { supabaseClient } from '@/app/lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

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
  setupRealtime: () => () => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  setNotes: (notes) => set({ notes }),
  
  addNote: async (note) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        notes: [...state.notes, data],
        currentNote: data,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateNote: async (noteId, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('notes')
        .update(updates)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? { ...note, ...data } : note
        ),
        currentNote: state.currentNote?.id === noteId ? data : state.currentNote,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabaseClient
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== noteId),
        currentNote: state.currentNote?.id === noteId ? null : state.currentNote,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),

  fetchNotes: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ notes: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
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
              set({ notes: [...store.notes, newRecord as Note] });
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
                  store.currentNote?.id === oldRecord.id ? null : store.currentNote,
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
