'use client';

import { useCallback, useMemo } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { useFolderStore } from '@/app/stores/folder-store';
import { SearchBar } from '../search/SearchBar';
import { ChevronRight, FolderIcon, FileText, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Button from '../ui/button';
import { toast } from 'sonner';
import { Note, Folder } from '@/types';

interface TreeItem {
  id: string;
  title: string;
  type: 'folder' | 'note';
  parentId: string | null;
  children?: TreeItem[];
}

export function Sidebar() {
  const { notes, currentNote, setCurrentNote, moveNote } = useNoteStore();
  const { folders, moveFolder } = useFolderStore();

  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;
    
    // 드롭 위치가 없거나 같은 위치로 드롭한 경우
    if (!destination || 
        (source.droppableId === destination.droppableId && 
         source.index === destination.index)) {
      return;
    }

    const sourceId = source.droppableId === 'root' ? null : source.droppableId;
    const destinationId = destination.droppableId === 'root' ? null : destination.droppableId;

    try {
      // 노트 이동
      if (type === 'note') {
        await moveNote(draggableId, destinationId);
        toast.success('노트가 이동되었습니다.');
      }
      // 폴더 이동
      else if (type === 'folder') {
        await moveFolder(draggableId, destinationId);
        toast.success('폴더가 이동되었습니다.');
      }
    } catch (error) {
      console.error('Error moving item:', error);
      toast.error('이동에 실패했습니다.');
    }
  }, [moveNote, moveFolder]);

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

    const buildTree = (parentId: string | null): TreeItem[] => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          ...item,
          children: item.type === 'folder' ? buildTree(item.id) : undefined,
        }));
    };

    return buildTree(null);
  }, [folders, notes]);

  const renderTreeItem = useCallback((item: TreeItem, index: number) => (
    <Draggable key={item.id} draggableId={item.id} index={index} type={item.type}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
            item.type === 'note' && currentNote?.id === item.id
              ? 'bg-primary/10'
              : 'hover:bg-primary/5'
          )}
          onClick={() => {
            if (item.type === 'note') {
              const note = notes.find((n) => n.id === item.id);
              if (note) setCurrentNote(note);
            }
          }}
        >
          {item.type === 'folder' ? (
            <FolderIcon className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="flex-1 truncate">{item.title}</span>
        </div>
      )}
    </Draggable>
  ), [currentNote, notes, setCurrentNote]);

  const renderTree = useCallback((items: TreeItem[], parentId: string | null = null) => (
    <Droppable droppableId={parentId || 'root'} type="note">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="pl-4"
        >
          {items.map((item, index) => (
            <div key={item.id}>
              {renderTreeItem(item, index)}
              {item.children && item.children.length > 0 && (
                <div className="ml-4">
                  {renderTree(item.children, item.id)}
                </div>
              )}
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ), [renderTreeItem]);

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Pepper</h2>
      </div>
      
      <div className="p-4">
        <SearchBar />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-auto">
          {renderTree(tree)}
        </div>
      </DragDropContext>
    </div>
  );
}
