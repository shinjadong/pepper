import useSWR from 'swr';
import { toast } from 'react-toastify';
import { UniqueIdentifier } from '@dnd-kit/core';
import { supabase } from '@/app/lib/supabase';
import { useNoteStore } from '@/app/stores/note-store';

const FOLDER_URL = 'folders';

export const useGetFolders = () => {
  const { data, error, isLoading, mutate } = useSWR(FOLDER_URL, async () => {
    const { data, error } = await supabase
      .from('folders')
      .select()
      .order('id', { ascending: true });

    if (error) throw error;

    return data;
  });

  return { data, error, isLoading, mutate };
};

export const useCreateFolder = () => {
  const { setFolders } = useNoteStore();

  const createFolder = async (id?: UniqueIdentifier) => {
    try {
      const title = prompt('Enter folder name:');
      if (!title) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .insert({
          title,
          parent_id: id?.toString() || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Folder created successfully');
      setFolders((prev) => [...prev, data]);
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast.error(error.message || 'Failed to create folder');
    }
  };

  return { createFolder };
};

export const useDeleteFolder = () => {
  const { setFolders } = useNoteStore();

  const deleteFolder = async (id: UniqueIdentifier) => {
    try {
      const { error } = await supabase.from('folders').delete().eq('id', id.toString());

      if (error) throw error;

      toast.success('Folder deleted successfully');
      setFolders((prev) => prev.filter((folder) => folder.id !== id.toString()));
    } catch (error: any) {
      console.error('Error deleting folder:', error);
      toast.error(error.message || 'Failed to delete folder');
    }
  };

  return { deleteFolder };
};

export const useRenameFolderTitle = () => {
  const renameFolder = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase.from('folders').update({ title: newTitle }).eq('id', id);

      if (error) throw error;

      toast.success('Folder renamed successfully');
    } catch (error: any) {
      console.error('Error renaming folder:', error);
      toast.error(error.message || 'Failed to rename folder');
    }
  };

  return { renameFolder };
};
