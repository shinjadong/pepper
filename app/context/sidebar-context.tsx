'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import { useNoteStore } from '../stores/note-store';
import { useFolderStore } from '../stores/folder-store';
import { useSearchStore } from '../stores/search-store';
import { toast } from 'sonner';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  createNewNote: () => Promise<void>;
  createNewFolder: () => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  moveNote: (noteId: string, folderId: string | null) => Promise<void>;
  moveFolder: (folderId: string, parentId: string | null) => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const addFolder = useFolderStore((state) => state.addFolder);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const deleteFolder = useFolderStore((state) => state.deleteFolder);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const createNewNote = useCallback(async () => {
    try {
      await addNote({
        title: 'Untitled Note',
        content: '',
        folder_id: null,
      });
      clearSearch();
      toast.success('New note created');
    } catch (error) {
      console.error('Failed to create note:', error);
      toast.error('Failed to create note');
    }
  }, [addNote, clearSearch]);

  const createNewFolder = useCallback(async () => {
    try {
      await addFolder({
        title: 'New Folder',
        parent_id: null,
      });
      clearSearch();
      toast.success('New folder created');
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
    }
  }, [addFolder, clearSearch]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      await deleteNote(noteId);
      clearSearch();
      toast.success('Note deleted');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
    }
  }, [deleteNote, clearSearch]);

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      clearSearch();
      toast.success('Folder deleted');
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
    }
  }, [deleteFolder, clearSearch]);

  const moveNote = useCallback(async (noteId: string, folderId: string | null) => {
    try {
      await updateNote(noteId, { folder_id: folderId });
      clearSearch();
      toast.success('Note moved');
    } catch (error) {
      console.error('Failed to move note:', error);
      toast.error('Failed to move note');
    }
  }, [updateNote, clearSearch]);

  const moveFolder = useCallback(async (folderId: string, parentId: string | null) => {
    try {
      await updateFolder(folderId, { parent_id: parentId });
      clearSearch();
      toast.success('Folder moved');
    } catch (error) {
      console.error('Failed to move folder:', error);
      toast.error('Failed to move folder');
    }
  }, [updateFolder, clearSearch]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        createNewNote,
        createNewFolder,
        deleteNote: handleDeleteNote,
        deleteFolder: handleDeleteFolder,
        moveNote,
        moveFolder,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
