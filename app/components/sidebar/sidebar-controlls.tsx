'use client';

import React from 'react';
import { useSidebarContext } from '../../context/sidebar-context';

export default function SidebarControlls() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <div className="flex items-center justify-between border-b border-gray-700 p-4">
      <h1 className="text-xl font-bold">Pepper</h1>
      <button
        onClick={toggleSidebar}
        className="rounded p-1 hover:bg-gray-700"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
