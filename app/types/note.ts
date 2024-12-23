export interface Note {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}
