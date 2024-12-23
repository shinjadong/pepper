export type BlockType =
  | 'text'
  | 'heading'
  | 'bulleted-list'
  | 'numbered-list'
  | 'todo'
  | 'quote'
  | 'code'
  | 'divider'
  | 'file'
  | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: {
    text?: string;
    checked?: boolean;
    language?: string;
    url?: string;
    type?: 'image' | 'file';
    name?: string;
    size?: number;
  };
  page_id: string;
  parent_block_id: string | null;
  position: number;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}
