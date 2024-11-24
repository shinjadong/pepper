import { supabase } from '@/app/lib/supabase';

export class FolderService {
  async createFolder(title: string, userId: string, parentId?: string) {
    const { data, error } = await supabase
      .from('folders')
      .insert([
        {
          title,
          user_id: userId,
          parent_id: parentId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to create folder: ' + error.message);
    }

    return data;
  }

  async getFolders(userId: string) {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to get folders: ' + error.message);
    }

    return data;
  }

  async updateFolder(id: string, userId: string, updates: { title?: string }) {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to update folder: ' + error.message);
    }

    return data;
  }

  async deleteFolder(id: string, userId: string) {
    const { error } = await supabase.from('folders').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to delete folder: ' + error.message);
    }

    return true;
  }
}
