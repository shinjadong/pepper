'use client';

import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Header } from '../header/Header';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
