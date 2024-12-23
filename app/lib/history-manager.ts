import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface HistoryEntry {
  id?: string;
  type: string;
  noteId?: string;
  folderId?: string;
  fromFolderId?: string | null;
  toFolderId?: string | null;
  timestamp: string;
  metadata?: Record<string, any>;
}

class HistoryManager {
  private supabase = createClientComponentClient();
  private static instance: HistoryManager;

  private constructor() {}

  static getInstance(): HistoryManager {
    if (!HistoryManager.instance) {
      HistoryManager.instance = new HistoryManager();
    }
    return HistoryManager.instance;
  }

  async addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    try {
      const { data, error } = await this.supabase
        .from('history')
        .insert({
          ...entry,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add history entry:', error);
      throw error;
    }
  }

  async getHistory(
    type?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<HistoryEntry[]> {
    try {
      let query = this.supabase
        .from('history')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get history:', error);
      throw error;
    }
  }

  async undo(entry: HistoryEntry): Promise<void> {
    try {
      switch (entry.type) {
        case 'MOVE_NOTE':
          if (entry.noteId && entry.fromFolderId !== undefined) {
            await this.supabase
              .from('notes')
              .update({ folder_id: entry.fromFolderId })
              .eq('id', entry.noteId);
          }
          break;

        case 'MOVE_FOLDER':
          if (entry.folderId && entry.fromFolderId !== undefined) {
            await this.supabase
              .from('folders')
              .update({ parent_id: entry.fromFolderId })
              .eq('id', entry.folderId);
          }
          break;

        // 다른 작업 타입에 대한 실행 취소 로직 추가
      }

      // 실행 취소 작업을 히스토리에 기록
      await this.addEntry({
        type: `UNDO_${entry.type}`,
        noteId: entry.noteId,
        folderId: entry.folderId,
        fromFolderId: entry.toFolderId,
        toFolderId: entry.fromFolderId,
        metadata: {
          originalEntry: entry,
        },
      });
    } catch (error) {
      console.error('Failed to undo history entry:', error);
      throw error;
    }
  }

  async clearHistory(): Promise<void> {
    try {
      const { error } = await this.supabase.from('history').delete().gt('id', 0);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  }
}

export const historyManager = HistoryManager.getInstance();
