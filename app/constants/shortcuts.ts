'use client';

import { ShortcutDefinition } from '../types/shortcuts';

// 클라이언트 측에서 실행될 액션 함수들을 정의
const actions = {
  createNewNote: () => {
    console.log('Creating new note...');
  },
  saveNote: () => {
    console.log('Saving note...');
  },
  toggleAI: () => {
    console.log('Toggling AI assistant...');
  },
  quickSearch: () => {
    console.log('Opening quick search...');
  },
  toggleSidebar: () => {
    console.log('Toggling sidebar...');
  },
};

export const DEFAULT_SHORTCUTS: ShortcutDefinition[] = [
  // Editor shortcuts
  {
    id: 'new-note',
    key: 'n',
    modifiers: ['ctrl'],
    description: 'Create a new note',
    category: 'editor',
    action: actions.createNewNote,
    enabled: true,
  },
  {
    id: 'save-note',
    key: 's',
    modifiers: ['ctrl'],
    description: 'Save current note',
    category: 'editor',
    action: actions.saveNote,
    enabled: true,
  },

  // Assistant shortcuts
  {
    id: 'toggle-ai',
    key: 'space',
    modifiers: ['ctrl'],
    description: 'Toggle AI assistant',
    category: 'assistant',
    action: actions.toggleAI,
    enabled: true,
  },

  // Navigation shortcuts
  {
    id: 'quick-search',
    key: 'p',
    modifiers: ['ctrl'],
    description: 'Quick search',
    category: 'navigation',
    action: actions.quickSearch,
    enabled: true,
  },

  // System shortcuts
  {
    id: 'toggle-sidebar',
    key: 'b',
    modifiers: ['ctrl'],
    description: 'Toggle sidebar',
    category: 'system',
    action: actions.toggleSidebar,
    enabled: true,
  },
  {
    id: 'note.copy',
    keys: ['ctrl+c'],
    description: '선택한 노트 복사',
    handler: (context) => {
      const { selectedNote } = context;
      if (!selectedNote) return;
      context.clipboard.copyNote(selectedNote);
    },
  },
  {
    id: 'note.cut',
    keys: ['ctrl+x'],
    description: '선택한 노트 잘라내기',
    handler: (context) => {
      const { selectedNote } = context;
      if (!selectedNote) return;
      context.clipboard.cutNote(selectedNote);
    },
  },
  {
    id: 'note.paste',
    keys: ['ctrl+v'],
    description: '노트 붙여넣기',
    handler: (context) => {
      const { selectedFolderId } = context;
      context.clipboard.pasteNote(selectedFolderId);
    },
  },
];
