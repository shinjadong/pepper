'use client';

import { useCallback } from 'react';
import { useSupabase } from '../components/providers/supabase-provider';
import { useNoteStore } from '../stores/note-store';
import { Note } from '@/types/note';

export const useDeleteNote = () => {
  const { supabase } = useSupabase();
  const deleteNoteFromStore = useNoteStore((state) => state.deleteNote);

  const deleteNote = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      deleteNoteFromStore(id);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }, [supabase, deleteNoteFromStore]);

  return { deleteNote };
};

export const useCreateNote = () => {
  const { supabase } = useSupabase();
  const addNote = useNoteStore((state) => state.addNote);

  const createNote = useCallback(async (note: Omit<Note, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');
      
      addNote(data);
      return data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }, [supabase, addNote]);

  return { createNote };
};

export const useUpdateNote = () => {
  const { supabase } = useSupabase();
  const updateNoteInStore = useNoteStore((state) => state.updateNote);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');
      
      updateNoteInStore(id, data);
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }, [supabase, updateNoteInStore]);

  return { updateNote };
};
