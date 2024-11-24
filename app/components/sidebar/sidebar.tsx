'use client';

import React from 'react';
import { useSidebarContext } from '../../context/sidebar-context';
import SidebarMenu from './sidebar-menu';
import SidebarControlls from './sidebar-controlls';

export default function Sidebar() {
  const { isSidebarOpen } = useSidebarContext();

  return (
    <aside
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-0'
      }`}
    >
      {isSidebarOpen && (
        <div className="flex h-full flex-col">
          <SidebarControlls />
          <SidebarMenu />
        </div>
      )}
    </aside>
  );
}
