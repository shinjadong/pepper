export type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';
export type KeyboardKey = string;

export interface ShortcutDefinition {
  id: string;
  key: KeyboardKey;
  modifiers: ModifierKey[];
  description: string;
  category: ShortcutCategory;
  action: () => void | Promise<void>;
  enabled?: boolean;
}

export type ShortcutCategory = 'editor' | 'assistant' | 'navigation' | 'system' | 'custom';

export interface ShortcutMap {
  [id: string]: ShortcutDefinition;
}

export interface ShortcutManagerConfig {
  shortcuts: ShortcutDefinition[];
  enableLogging?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface ShortcutEvent {
  type: 'shortcut-triggered' | 'shortcut-registered' | 'shortcut-error';
  shortcutId: string;
  timestamp: number;
  error?: Error;
}

export type ShortcutEventHandler = (event: ShortcutEvent) => void;

export interface ShortcutContext {
  register: (shortcut: ShortcutDefinition) => void;
  unregister: (shortcutId: string) => void;
  trigger: (shortcutId: string) => Promise<void>;
  isRegistered: (shortcutId: string) => boolean;
  getShortcut: (shortcutId: string) => ShortcutDefinition | undefined;
  getAllShortcuts: () => ShortcutDefinition[];
  addEventListener: (handler: ShortcutEventHandler) => void;
  removeEventListener: (handler: ShortcutEventHandler) => void;
}

export interface ShortcutProviderProps {
  children: React.ReactNode;
  config?: ShortcutManagerConfig;
}
