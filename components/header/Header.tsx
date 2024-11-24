'use client';

import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <div className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <div className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <div className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
};
