import React from 'react';
import { useShortcuts } from '@/context/ShortcutContext';
import { ShortcutDefinition } from '@/types/shortcuts';

interface ShortcutManagerProps {
  children?: React.ReactNode;
}

interface ShortcutItemProps {
  shortcut: ShortcutDefinition;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ shortcut }) => {
  const modifierString = shortcut.modifiers
    .map((mod) => mod.charAt(0).toUpperCase() + mod.slice(1))
    .join(' + ');
  const keyString = shortcut.key.toUpperCase();

  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
      <div className="flex-1">
        <div className="text-sm font-medium">{shortcut.description}</div>
        <div className="text-xs text-gray-500">{shortcut.category}</div>
      </div>
      <div className="flex items-center space-x-1">
        {modifierString.split(' + ').map((mod, i) => (
          <React.Fragment key={i}>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
              {mod}
            </kbd>
            {i < shortcut.modifiers.length - 1 && <span className="text-gray-500">+</span>}
          </React.Fragment>
        ))}
        <span className="text-gray-500">+</span>
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
          {keyString}
        </kbd>
      </div>
    </div>
  );
};

export const ShortcutManager: React.FC<ShortcutManagerProps> = ({ children }) => {
  const { getAllShortcuts } = useShortcuts();
  const shortcuts = getAllShortcuts();
  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 px-4 text-gray-700 dark:text-gray-300">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {shortcuts
                .filter((s) => s.category === category)
                .map((shortcut) => (
                  <ShortcutItem key={shortcut.id} shortcut={shortcut} />
                ))}
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};
