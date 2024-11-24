import { create } from 'zustand';
import { supabaseClient } from '@/app/lib/supabase';
import { Note } from './note-store';

interface SearchState {
  searchQuery: string;
  searchResults: Note[];
  isSearching: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  searchNotes: () => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  error: null,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    if (!query) {
      set({ searchResults: [], error: null });
    }
  },

  searchNotes: async () => {
    const { searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ searchResults: [], error: null });
      return;
    }

    try {
      set({ isSearching: true, error: null });

      const { data: notes, error } = await supabaseClient
        .from('notes')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ searchResults: notes || [], isSearching: false });
    } catch (error: any) {
      console.error('Search error:', error);
      set({
        error: error.message || 'Failed to search notes',
        isSearching: false,
      });
    }
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      error: null,
    });
  },
}));
