'use client';

import React from 'react';

export default function SidebarSubMenu() {
  return (
    <div className="mb-4">
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">Quick Access</h2>
      <nav>
        <ul className="space-y-1">
          <li>
            <a href="#" className="block rounded px-3 py-2 hover:bg-gray-700">
              Recent Notes
            </a>
          </li>
          <li>
            <a href="#" className="block rounded px-3 py-2 hover:bg-gray-700">
              Favorites
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
