import { AssistantContext } from './assistant';

export interface EditorState {
  content: string;
  cursorPosition: number;
  selection?: {
    start: number;
    end: number;
  };
  fileType: string;
  filePath?: string;
  dirty: boolean;
}

export interface WorkspaceContext {
  currentFile?: string;
  openFiles: string[];
  recentFiles: string[];
  gitBranch?: string;
}

export interface UserContext {
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    aiMode: 'aggressive' | 'conservative' | 'manual';
    autoComplete: boolean;
    suggestions: boolean;
  };
  history: {
    recentCommands: string[];
    recentSearches: string[];
    recentSuggestions: string[];
  };
}

export interface GlobalContext {
  editor: EditorState;
  workspace: WorkspaceContext;
  user: UserContext;
  assistant: AssistantContext;
}

export type ContextUpdateHandler = (context: Partial<GlobalContext>) => void;

export interface ContextSubscriber {
  id: string;
  filter?: (keyof GlobalContext)[];
  handler: ContextUpdateHandler;
}

export type ContextSelector<T> = (context: GlobalContext) => T;

export interface ContextProviderProps {
  children: React.ReactNode;
  initialContext?: Partial<GlobalContext>;
}
