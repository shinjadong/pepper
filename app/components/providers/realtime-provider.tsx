'use client';

import { useEffect } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { useFolderStore } from '@/app/stores/folder-store';
import { useSupabase } from './supabase-provider';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase();
  const setupNotesRealtime = useNoteStore((state) => state.setupRealtime);
  const setupFoldersRealtime = useFolderStore((state) => state.setupRealtime);
  const fetchNotes = useNoteStore((state) => state.fetchNotes);
  const fetchFolders = useFolderStore((state) => state.fetchFolders);

  useEffect(() => {
    if (session?.user?.id) {
      // Initial data fetch
      fetchNotes().catch(console.error);
      fetchFolders().catch(console.error);

      // Setup realtime subscriptions
      const unsubscribeNotes = setupNotesRealtime();
      const unsubscribeFolders = setupFoldersRealtime();

      return () => {
        unsubscribeNotes();
        unsubscribeFolders();
      };
    }
  }, [session?.user?.id, fetchNotes, fetchFolders, setupNotesRealtime, setupFoldersRealtime]);

  return <>{children}</>;
}
