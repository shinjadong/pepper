import { Suggestion, Completion } from './ai';

export type AssistantPosition = 'cursor' | 'sidebar' | 'floating';
export type AssistantMode = 'writing' | 'coding' | 'analysis';

export interface AssistantState {
  isVisible: boolean;
  position: AssistantPosition;
  mode: AssistantMode;
  isLoading: boolean;
  error?: string;
}

export interface AssistantContext {
  content: string;
  selection?: string;
  cursorPosition: number;
  fileType: string;
  suggestions?: Suggestion[];
  completion?: Completion;
}

export interface AssistantProps {
  position?: AssistantPosition;
  mode?: AssistantMode;
  context: AssistantContext;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onModeChange?: (mode: AssistantMode) => void;
  onPositionChange?: (position: AssistantPosition) => void;
  className?: string;
}
