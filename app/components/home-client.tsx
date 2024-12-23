'use client';

import { useEffect } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { useFolderStore } from '@/app/stores/folder-store';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/components/providers/supabase-provider';
import { toast } from 'sonner';
import { Sidebar } from '@/app/components/sidebar/sidebar';
import { NoteList } from '@/app/components/note/note-list';
import { NoteEditForm } from '@/app/components/note-edit/note-edit-form';

export function HomeClient() {
  const { fetchNotes } = useNoteStore();
  const { fetchFolders } = useFolderStore();
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchNotes(), fetchFolders()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      }
    };

    fetchData();
  }, [fetchNotes, fetchFolders]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex">
        <NoteList />
        <NoteEditForm />
      </div>
    </div>
  );
}
