import { create } from 'zustand';
import { supabaseClient } from '../lib/supabase';
import { Folder } from '@/types';
import { buildFolderTree, sortFolders } from '../lib/folder-utils';
import { toast } from 'sonner';

interface FolderStore {
  folders: Folder[];
  currentFolder: Folder | null;
  isLoading: boolean;
  error: string | null;
  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Partial<Folder>) => Promise<void>;
  updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  setCurrentFolder: (folder: Folder | null) => void;
  fetchFolders: () => Promise<void>;
  moveFolder: (folderId: string, targetParentId: string | null) => Promise<void>;
  setupRealtime: () => () => void;
  getFolderPath: (folderId: string) => Promise<Folder[]>;
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  currentFolder: null,
  isLoading: false,
  error: null,

  setFolders: (folders) => set({ folders }),
  setCurrentFolder: (folder) => set({ currentFolder: folder }),

  fetchFolders: async () => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('folders')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      const sortedFolders = sortFolders(data || []);
      set({ folders: sortedFolders });
    } catch (error: any) {
      console.error('Failed to fetch folders:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addFolder: async (folder) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('folders')
        .insert([folder])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('폴더 생성에 실패했습니다');

      set((state) => ({
        folders: sortFolders([...state.folders, data]),
      }));
      toast.success('폴더가 생성되었습니다');
    } catch (error: any) {
      console.error('Failed to add folder:', error);
      set({ error: error.message });
      toast.error('폴더 생성에 실패했습니다');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFolder: async (folderId, updates) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabaseClient
        .from('folders')
        .update(updates)
        .eq('id', folderId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('폴더를 찾을 수 없습니다');

      set((state) => ({
        folders: sortFolders(
          state.folders.map((f) => (f.id === folderId ? data : f))
        ),
      }));
      toast.success('폴더가 수정되었습니다');
    } catch (error: any) {
      console.error('Failed to update folder:', error);
      set({ error: error.message });
      toast.error('폴더 수정에 실패했습니다');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFolder: async (folderId) => {
    try {
      set({ isLoading: true });

      // 하위 폴더 확인
      const subFolders = get().folders.filter((f) => f.parent_id === folderId);
      if (subFolders.length > 0) {
        throw new Error('하위 폴더가 있는 폴더는 삭제할 수 없습니다');
      }

      const { error } = await supabaseClient
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      set((state) => ({
        folders: state.folders.filter((f) => f.id !== folderId),
        currentFolder:
          state.currentFolder?.id === folderId ? null : state.currentFolder,
      }));
      toast.success('폴더가 삭제되었습니다');
    } catch (error: any) {
      console.error('Failed to delete folder:', error);
      set({ error: error.message });
      toast.error(
        error.message === '하위 폴더가 있는 폴더는 삭제할 수 없습니다'
          ? error.message
          : '폴더 삭제에 실패했습니다'
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  moveFolder: async (folderId, targetParentId) => {
    try {
      set({ isLoading: true });

      // 순환 참조 체크
      if (targetParentId) {
        const path = await get().getFolderPath(targetParentId);
        if (path.some((folder) => folder.id === folderId)) {
          throw new Error('폴더를 자신의 하위 폴더로 이동할 수 없습니다');
        }
      }

      const folders = get().folders;
      const folderToMove = folders.find((folder) => folder.id === folderId);
      if (!folderToMove) {
        throw new Error('이동할 폴더를 찾을 수 없습니다');
      }

      // 낙관적 업데이트
      const updatedFolders = folders.map((folder) =>
        folder.id === folderId ? { ...folder, parent_id: targetParentId } : folder
      );
      set({ folders: sortFolders(updatedFolders) });

      const { data, error } = await supabaseClient
        .from('folders')
        .update({ parent_id: targetParentId })
        .eq('id', folderId)
        .select()
        .single();

      if (error) {
        // 실패 시 롤백
        set({ folders });
        throw error;
      }

      if (!data) {
        set({ folders });
        throw new Error('폴더를 찾을 수 없습니다');
      }

      toast.success('폴더가 이동되었습니다');
    } catch (error: any) {
      console.error('Failed to move folder:', error);
      set({ error: error.message });
      toast.error(
        error.message === '폴더를 자신의 하위 폴더로 이동할 수 없습니다' ||
        error.message === '이동할 폴더를 찾을 수 없습니다' ||
        error.message === '폴더를 찾을 수 없습니다'
          ? error.message
          : '폴더 이동에 실패했습니다'
      );
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setupRealtime: () => {
    const channel = supabaseClient
      .channel('folders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
        },
        async (payload) => {
          const { eventType } = payload;
          await get().fetchFolders();
          console.log(`Folder ${eventType}`);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },

  getFolderPath: async (folderId) => {
    const path: Folder[] = [];
    let currentId = folderId;
    const folders = get().folders;

    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (!folder) break;
      path.unshift(folder);
      currentId = folder.parent_id;
    }

    return path;
  },
}));
