'use client';

import React from 'react';

export default function SidebarGeneralControlls() {
  return (
    <div className="mt-auto">
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">General</h2>
      <nav>
        <ul className="space-y-1">
          <li>
            <button className="block w-full rounded px-3 py-2 text-left hover:bg-gray-700">
              Settings
            </button>
          </li>
          <li>
            <button className="block w-full rounded px-3 py-2 text-left hover:bg-gray-700">
              Keyboard Shortcuts
            </button>
          </li>
          <li>
            <button className="block w-full rounded px-3 py-2 text-left hover:bg-gray-700">
              Help & Support
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
