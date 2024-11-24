import { ShortcutDefinition } from '@/types/shortcuts';

export const DEFAULT_SHORTCUTS: ShortcutDefinition[] = [
  // Editor shortcuts
  {
    id: 'editor.newNote',
    key: 'n',
    modifiers: ['ctrl'],
    description: 'Create new note',
    category: 'editor',
    action: () => {
      // TODO: Implement new note creation
      console.log('Creating new note...');
    },
  },
  {
    id: 'editor.save',
    key: 's',
    modifiers: ['ctrl'],
    description: 'Save current note',
    category: 'editor',
    action: () => {
      // TODO: Implement save
      console.log('Saving note...');
    },
  },
  {
    id: 'editor.delete',
    key: 'd',
    modifiers: ['ctrl', 'shift'],
    description: 'Delete current note',
    category: 'editor',
    action: () => {
      // TODO: Implement delete
      console.log('Deleting note...');
    },
  },

  // Assistant shortcuts
  {
    id: 'assistant.toggle',
    key: 'space',
    modifiers: ['ctrl'],
    description: 'Toggle AI assistant',
    category: 'assistant',
    action: () => {
      // TODO: Implement assistant toggle
      console.log('Toggling assistant...');
    },
  },
  {
    id: 'assistant.mode.writing',
    key: '1',
    modifiers: ['ctrl', 'alt'],
    description: 'Switch to writing mode',
    category: 'assistant',
    action: () => {
      // TODO: Implement mode switch
      console.log('Switching to writing mode...');
    },
  },
  {
    id: 'assistant.mode.coding',
    key: '2',
    modifiers: ['ctrl', 'alt'],
    description: 'Switch to coding mode',
    category: 'assistant',
    action: () => {
      // TODO: Implement mode switch
      console.log('Switching to coding mode...');
    },
  },
  {
    id: 'assistant.mode.analysis',
    key: '3',
    modifiers: ['ctrl', 'alt'],
    description: 'Switch to analysis mode',
    category: 'assistant',
    action: () => {
      // TODO: Implement mode switch
      console.log('Switching to analysis mode...');
    },
  },

  // Navigation shortcuts
  {
    id: 'navigation.search',
    key: 'p',
    modifiers: ['ctrl'],
    description: 'Search notes',
    category: 'navigation',
    action: () => {
      // TODO: Implement search
      console.log('Opening search...');
    },
  },
  {
    id: 'navigation.back',
    key: '[',
    modifiers: ['ctrl'],
    description: 'Go back',
    category: 'navigation',
    action: () => {
      // TODO: Implement navigation
      console.log('Going back...');
    },
  },
  {
    id: 'navigation.forward',
    key: ']',
    modifiers: ['ctrl'],
    description: 'Go forward',
    category: 'navigation',
    action: () => {
      // TODO: Implement navigation
      console.log('Going forward...');
    },
  },

  // System shortcuts
  {
    id: 'system.preferences',
    key: ',',
    modifiers: ['ctrl'],
    description: 'Open preferences',
    category: 'system',
    action: () => {
      // TODO: Implement preferences
      console.log('Opening preferences...');
    },
  },
  {
    id: 'system.theme',
    key: 't',
    modifiers: ['ctrl', 'shift'],
    description: 'Toggle dark mode',
    category: 'system',
    action: () => {
      // TODO: Implement theme toggle
      console.log('Toggling theme...');
    },
  },
];
