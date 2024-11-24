import { supabase } from './supabase';
import { BaseNote } from '@/types';
import { toast } from 'react-hot-toast';

export const fetchNotes = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as BaseNote[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    toast.error('Failed to fetch notes');
    throw error;
  }
};

export const createNote = async (note: Omit<BaseNote, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase.from('notes').insert([note]).select().single();

    if (error) throw error;
    toast.success('Note created successfully');
    return data as BaseNote;
  } catch (error) {
    console.error('Error creating note:', error);
    toast.error('Failed to create note');
    throw error;
  }
};

export const updateNote = async (note: Partial<BaseNote> & { id: string }) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        ...note,
        updated_at: new Date().toISOString(),
      })
      .eq('id', note.id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Note updated successfully');
    return data as BaseNote;
  } catch (error) {
    console.error('Error updating note:', error);
    toast.error('Failed to update note');
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const { error } = await supabase.from('notes').delete().eq('id', noteId);

    if (error) throw error;
    toast.success('Note deleted successfully');
  } catch (error) {
    console.error('Error deleting note:', error);
    toast.error('Failed to delete note');
    throw error;
  }
};
