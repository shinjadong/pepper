export interface Block {
  id: string;
  type: 'text' | 'image' | 'file' | 'ai';
  content: {
    text?: string;
    url?: string;
    type?: 'text' | 'image';
  };
  properties: Record<string, any>;
  parentId?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface View {
  id: string;
  name: string;
  type: 'database' | 'calendar' | 'gallery';
  config: {
    columns?: {
      id: string;
      name: string;
      type: string;
      width?: number;
    }[];
    sorts?: {
      id: string;
      desc: boolean;
    }[];
    filters?: {
      id: string;
      field: string;
      operator: string;
      value: any;
    }[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  is_trashed: boolean;
}

export interface Folder {
  id: string;
  title: string;
  parent_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  icon?: string;
  color?: string;
}
