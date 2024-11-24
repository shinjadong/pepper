'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { ShortcutManager } from '../services/shortcuts/ShortcutManager';
import {
  ShortcutContext as IShortcutContext,
  ShortcutProviderProps,
  ShortcutDefinition,
  ShortcutEventHandler,
} from '../types/shortcuts';
import { DEFAULT_SHORTCUTS } from '../constants/shortcuts';

const ShortcutContext = createContext<IShortcutContext | null>(null);

export const ShortcutProvider: React.FC<ShortcutProviderProps> = ({
  children,
  config = { shortcuts: DEFAULT_SHORTCUTS },
}) => {
  const manager = React.useMemo(() => new ShortcutManager(config), []);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, [manager]);

  const contextValue: IShortcutContext = {
    register: (shortcut: ShortcutDefinition) => manager.register(shortcut),
    unregister: (shortcutId: string) => manager.unregister(shortcutId),
    trigger: (shortcutId: string) => manager.trigger(shortcutId),
    isRegistered: (shortcutId: string) => manager.isRegistered(shortcutId),
    getShortcut: (shortcutId: string) => manager.getShortcut(shortcutId),
    getAllShortcuts: () => manager.getAllShortcuts(),
    addEventListener: (handler: ShortcutEventHandler) => manager.addEventListener(handler),
    removeEventListener: (handler: ShortcutEventHandler) => manager.removeEventListener(handler),
  };

  return <ShortcutContext.Provider value={contextValue}>{children}</ShortcutContext.Provider>;
};

export const useShortcuts = () => {
  const context = useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  return context;
};

export const useShortcut = (shortcut: ShortcutDefinition) => {
  const { register, unregister } = useShortcuts();

  useEffect(() => {
    register(shortcut);
    return () => {
      unregister(shortcut.id);
    };
  }, [shortcut, register, unregister]);
};

export { DEFAULT_SHORTCUTS };
