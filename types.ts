export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  note_count?: number;
  children?: Folder[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_favorite?: boolean;
  is_trashed?: boolean;
  trashed_at?: string;
}

export interface History {
  id: string;
  type: 'MOVE_NOTE' | 'MOVE_FOLDER' | 'RENAME_NOTE' | 'RENAME_FOLDER';
  note_id?: string;
  folder_id?: string;
  from_folder_id?: string | null;
  to_folder_id?: string | null;
  from_name?: string;
  to_name?: string;
  timestamp: string;
  user_id: string;
}

export type BlockType = 
  | 'text'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bullet_list'
  | 'numbered_list'
  | 'todo'
  | 'toggle'
  | 'code'
  | 'quote'
  | 'image'
  | 'table'
  | 'divider';

export interface BlockData {
  text?: string;
  checked?: boolean;
  language?: string;
  url?: string;
  caption?: string;
  columns?: number;
  rows?: number;
}

export interface Block {
  id: string;
  type: BlockType;
  content: BlockData;
  page_id: string;
  parent_block_id: string | null;
  position: number;
  children?: Block[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover_image?: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  last_edited_by: string;
  blocks: Block[];
}

export interface User {
  id: string;
  name: string;
  avatar_url: string;
  color?: string;
  last_seen?: string;
}

export interface Presence {
  id: string;
  user_id: string;
  note_id: string | null;
  block_id: string | null;
  cursor_position?: {
    x: number;
    y: number;
  };
  selection?: {
    start: number;
    end: number;
  };
  last_seen: string;
}
