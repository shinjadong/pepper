export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string;
          title: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          folder_id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string;
          folder_id: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          folder_id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          icon: string | null;
          cover_image: string | null;
          parent_id: string | null;
          workspace_id: string;
          created_at: string;
          updated_at: string;
          created_by: string;
          last_edited_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          icon?: string | null;
          cover_image?: string | null;
          parent_id?: string | null;
          workspace_id: string;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          last_edited_by: string;
        };
        Update: {
          id?: string;
          title?: string;
          icon?: string | null;
          cover_image?: string | null;
          parent_id?: string | null;
          workspace_id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          last_edited_by?: string;
        };
      };
      blocks: {
        Row: {
          id: string;
          type: string;
          content: Json;
          page_id: string;
          parent_block_id: string | null;
          position: number;
          properties: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          content: Json;
          page_id: string;
          parent_block_id?: string | null;
          position: number;
          properties?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          content?: Json;
          page_id?: string;
          parent_block_id?: string | null;
          position?: number;
          properties?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      database_views: {
        Row: {
          id: string;
          page_id: string;
          type: string;
          properties: Json;
          filters: Json;
          sorts: Json;
        };
        Insert: {
          id?: string;
          page_id: string;
          type: string;
          properties?: Json;
          filters?: Json;
          sorts?: Json;
        };
        Update: {
          id?: string;
          page_id?: string;
          type?: string;
          properties?: Json;
          filters?: Json;
          sorts?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
