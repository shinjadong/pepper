'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BaseFolder } from '@/types';
import { supabase } from '@/app/lib/supabase';
import { useSupabaseSession } from '@/app/components/providers/supabase-provider';
import { FolderIcon } from 'lucide-react';
import { useFolderStore } from '@/app/stores/folder-store';

export function Folders({ isCollapsed }: { isCollapsed: boolean }) {
  const [folders, setFolders] = useState<BaseFolder[]>([]);
  const { session } = useSupabaseSession();
  const { selectedFolder, setSelectedFolder } = useFolderStore();

  useEffect(() => {
    if (session?.user?.id) {
      loadFolders();
    }
  }, [session]);

  const loadFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    }
  };

  const createFolder = async () => {
    if (!session?.user?.id) {
      toast.error('Please login first');
      return;
    }

    try {
      const title = prompt('Enter folder name:');
      if (!title) return;

      const { data, error } = await supabase
        .from('folders')
        .insert([
          {
            title,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setFolders([...folders, data]);
      toast.success('Folder created successfully');
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast.error(error.message || 'Failed to create folder');
    }
  };

  const handleFolderClick = (folder: BaseFolder) => {
    setSelectedFolder(selectedFolder?.id === folder.id ? null : folder);
  };

  if (!session) {
    return <div className="p-2 text-center text-gray-500">Please login to manage folders</div>;
  }

  return (
    <div className="p-2">
      {!isCollapsed && (
        <button
          onClick={createFolder}
          className="w-full p-2 text-left hover:bg-zinc-700 rounded flex items-center gap-2"
        >
          <FolderIcon size={16} />
          <span>New Folder</span>
        </button>
      )}
      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => handleFolderClick(folder)}
          className={`w-full p-2 text-left rounded flex items-center gap-2 ${
            selectedFolder?.id === folder.id ? 'bg-zinc-700' : 'hover:bg-zinc-700'
          }`}
        >
          <FolderIcon size={16} />
          <span>{folder.title}</span>
        </button>
      ))}
    </div>
  );
}
