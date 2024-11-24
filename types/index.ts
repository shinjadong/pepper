// 기본 타입들
export interface BaseNote {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseFolder {
  id: string;
  title: string;
  parentId: string | null;
  children?: BaseFolder[];
  notes?: BaseNote[];
  createdAt: Date;
  updatedAt: Date;
}

// AI 관련 타입
export interface AIContext {
  noteId: string;
  selection?: {
    start: number;
    end: number;
    text: string;
  };
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
