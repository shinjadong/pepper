'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useState } from 'react';

interface DragAndDropProviderProps {
  children: React.ReactNode;
}

export function DragAndDropProvider({ children }: DragAndDropProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>{activeId ? <div>Dragging {activeId}</div> : null}</DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }
}
