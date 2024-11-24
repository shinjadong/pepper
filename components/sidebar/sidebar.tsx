'use client';

import { useCallback, useMemo } from 'react';
import { useSidebar } from '@/app/context/sidebar-context';
import { useNoteStore } from '@/app/stores/note-store';
import { useFolderStore } from '@/app/stores/folder-store';
import { SearchBar } from '../search/SearchBar';
import { ChevronRight, FolderIcon, FileText, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface TreeItem {
  id: string;
  title: string;
  type: 'folder' | 'note';
  parentId: string | null;
  children?: TreeItem[];
}

export function Sidebar() {
  const { isOpen, toggleSidebar, createNewNote, createNewFolder, moveNote, moveFolder } = useSidebar();
  const notes = useNoteStore((state) => state.notes);
  const currentNote = useNoteStore((state) => state.currentNote);
  const setCurrentNote = useNoteStore((state) => state.setCurrentNote);
  const folders = useFolderStore((state) => state.folders);

  // Build tree structure
  const tree = useMemo(() => {
    const items: TreeItem[] = [
      ...folders.map((folder) => ({
        id: folder.id,
        title: folder.title,
        type: 'folder' as const,
        parentId: folder.parent_id,
        children: [],
      })),
      ...notes.map((note) => ({
        id: note.id,
        title: note.title,
        type: 'note' as const,
        parentId: note.folder_id,
      })),
    ];

    const map = new Map<string, TreeItem>();
    const roots: TreeItem[] = [];

    items.forEach((item) => map.set(item.id, item));
    items.forEach((item) => {
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(item);
        }
      } else {
        roots.push(item);
      }
    });

    return roots;
  }, [folders, notes]);

  const handleDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const sourceId = result.draggableId;
      const destinationId = result.destination.droppableId;

      if (result.type === 'note') {
        moveNote(sourceId, destinationId === 'root' ? null : destinationId);
      } else {
        moveFolder(sourceId, destinationId === 'root' ? null : destinationId);
      }
    },
    [moveNote, moveFolder]
  );

  const renderTreeItem = useCallback(
    (item: TreeItem, level = 0) => (
      <Draggable key={item.id} draggableId={item.id} index={level}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              'group flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer',
              item.type === 'note' &&
                currentNote?.id === item.id &&
                'bg-blue-50 dark:bg-blue-900/20'
            )}
            style={{ marginLeft: `${level * 12}px` }}
            onClick={() => {
              if (item.type === 'note') {
                const note = notes.find((n) => n.id === item.id);
                if (note) setCurrentNote(note);
              }
            }}
          >
            {item.type === 'folder' ? (
              <>
                <FolderIcon className="w-4 h-4 text-yellow-500" />
                <span className="flex-1 truncate">{item.title}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="flex-1 truncate">{item.title}</span>
              </>
            )}
          </div>
        )}
      </Draggable>
    ),
    [currentNote?.id, notes, setCurrentNote]
  );

  const renderTree = useCallback(
    (items: TreeItem[], level = 0) => (
      <>
        {items.map((item) => (
          <div key={item.id}>
            {renderTreeItem(item, level)}
            {item.children && renderTree(item.children, level + 1)}
          </div>
        ))}
      </>
    ),
    [renderTreeItem]
  );

  return (
    <div
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300',
        isOpen ? 'w-64' : 'w-0'
      )}
    >
      {isOpen && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Notes</h2>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={createNewNote}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex-1"
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
            <button
              onClick={createNewFolder}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700"
            >
              <FolderIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Tree */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="root" type="TREE">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-auto px-2 py-4"
                >
                  {renderTree(tree)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
