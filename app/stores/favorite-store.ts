import { create } from 'zustand';
import { Note } from '@/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FavoriteStore {
  favorites: Note[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (note: Note) => Promise<void>;
  removeFromFavorites: (noteId: string) => Promise<void>;
  isFavorite: (noteId: string) => boolean;
  fetchFavorites: () => Promise<void>;
}

const supabaseClient = createClientComponentClient();

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  addToFavorites: async (note) => {
    try {
      set({ isLoading: true });

      // 즐겨찾기 추가
      const { error } = await supabaseClient
        .from('favorites')
        .insert({ note_id: note.id });

      if (error) throw error;

      // 로컬 상태 업데이트
      set((state) => ({
        favorites: [...state.favorites, note],
      }));
    } catch (error: any) {
      console.error('Failed to add to favorites:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromFavorites: async (noteId) => {
    try {
      set({ isLoading: true });

      // 즐겨찾기 제거
      const { error } = await supabaseClient
        .from('favorites')
        .delete()
        .eq('note_id', noteId);

      if (error) throw error;

      // 로컬 상태 업데이트
      set((state) => ({
        favorites: state.favorites.filter((note) => note.id !== noteId),
      }));
    } catch (error: any) {
      console.error('Failed to remove from favorites:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  isFavorite: (noteId) => {
    return get().favorites.some((note) => note.id === noteId);
  },

  fetchFavorites: async () => {
    try {
      set({ isLoading: true });

      // 즐겨찾기 목록 조회
      const { data, error } = await supabaseClient
        .from('favorites')
        .select('note_id, notes(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // 노트 데이터 추출
      const favorites = data
        .map((item) => item.notes)
        .filter((note): note is Note => note !== null);

      set({ favorites });
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
