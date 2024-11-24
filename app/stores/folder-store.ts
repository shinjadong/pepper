import { create } from 'zustand';
import { supabaseClient } from '@/app/lib/supabase';

export interface Folder {
  id: string;
  title: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface FolderStore {
  folders: Folder[];
  selectedFolderId: string | null;
  isLoading: boolean;
  error: string | null;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Partial<Folder>) => Promise<void>;
  updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  setSelectedFolderId: (folderId: string | null) => void;
  fetchFolders: () => Promise<void>;
  setupRealtime: () => () => void;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  selectedFolderId: null,
  isLoading: false,
  error: null,

  setFolders: (folders) => set({ folders }),

  addFolder: async (folder) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('folders')
        .insert([folder])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        folders: [...state.folders, data],
        selectedFolderId: data.id,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateFolder: async (folderId, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('folders')
        .update(updates)
        .eq('id', folderId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        folders: state.folders.map((folder) =>
          folder.id === folderId ? { ...folder, ...data } : folder
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteFolder: async (folderId) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabaseClient
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== folderId),
        selectedFolderId: state.selectedFolderId === folderId ? null : state.selectedFolderId,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setSelectedFolderId: (folderId) => set({ selectedFolderId: folderId }),

  fetchFolders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabaseClient
        .from('folders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      set({ folders: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setupRealtime: () => {
    const subscription = supabaseClient
      .channel('folders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          const store = get();

          switch (eventType) {
            case 'INSERT':
              set({ folders: [...store.folders, newRecord as Folder] });
              break;
            case 'UPDATE':
              set({
                folders: store.folders.map((folder) =>
                  folder.id === newRecord.id ? { ...folder, ...newRecord } : folder
                ),
              });
              break;
            case 'DELETE':
              set({
                folders: store.folders.filter((folder) => folder.id !== oldRecord.id),
                selectedFolderId:
                  store.selectedFolderId === oldRecord.id ? null : store.selectedFolderId,
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
