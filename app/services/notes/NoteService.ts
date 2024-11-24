import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Note = Database['public']['Tables']['notes']['Row'];
type NoteInsert = Database['public']['Tables']['notes']['Insert'];
type NoteUpdate = Database['public']['Tables']['notes']['Update'];

export class NoteService {
  static async create(data: Omit<NoteInsert, 'created_at' | 'updated_at'>) {
    const { data: note, error } = await supabase.from('notes').insert(data).select().single();

    if (error) throw error;
    return note;
  }

  static async update(id: string, data: Omit<NoteUpdate, 'id' | 'created_at' | 'updated_at'>) {
    const { data: note, error } = await supabase
      .from('notes')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return note;
  }

  static async delete(id: string) {
    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) throw error;
  }

  static async getById(id: string) {
    const { data: note, error } = await supabase.from('notes').select().eq('id', id).single();

    if (error) throw error;
    return note;
  }

  static async getByFolderId(folderId: string) {
    const { data: notes, error } = await supabase
      .from('notes')
      .select()
      .eq('folder_id', folderId)
      .order('title');

    if (error) throw error;
    return notes;
  }

  static async getAllByUserId(userId: string) {
    const { data: notes, error } = await supabase
      .from('notes')
      .select()
      .eq('user_id', userId)
      .order('title');

    if (error) throw error;
    return notes;
  }
}
