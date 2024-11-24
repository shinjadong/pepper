'use client';

import React from 'react';
import SidebarSubMenu from './sidebar-sub-menu';
import SidebarGeneralControlls from './sidebar-general-controlls';

export default function SidebarMenu() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <SidebarSubMenu />
      <SidebarGeneralControlls />
    </div>
  );
}
