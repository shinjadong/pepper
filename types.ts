export interface BaseFolder {
  id: string;
  title: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface BaseNote {
  id: string;
  title: string;
  content: string;
  folder_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
