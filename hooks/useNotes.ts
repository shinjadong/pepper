import { useCallback } from 'react';
import { useNoteStore } from '@/app/stores/note-store';
import { fetchNotes, createNote, updateNote, deleteNote } from '@/lib/api';
import { BaseNote } from '@/types';

export const useNotes = () => {
  const {
    notes,
    selectedNote,
    isLoading,
    error,
    setNotes,
    setSelectedNote,
    setLoading,
    setError,
    addNote,
    updateNote: updateNoteInStore,
    deleteNote: deleteNoteFromStore,
  } = useNoteStore();

  const loadNotes = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const notes = await fetchNotes(userId);
        setNotes(notes);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load notes');
      } finally {
        setLoading(false);
      }
    },
    [setNotes, setLoading, setError]
  );

  const createNewNote = useCallback(
    async (note: Omit<BaseNote, 'id' | 'created_at' | 'updated_at'>) => {
      setLoading(true);
      setError(null);
      try {
        const newNote = await createNote(note);
        addNote(newNote);
        return newNote;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to create note');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [addNote, setLoading, setError]
  );

  const updateExistingNote = useCallback(
    async (note: Partial<BaseNote> & { id: string }) => {
      setLoading(true);
      setError(null);
      try {
        const updatedNote = await updateNote(note);
        updateNoteInStore(updatedNote);
        return updatedNote;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update note');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateNoteInStore, setLoading, setError]
  );

  const deleteExistingNote = useCallback(
    async (noteId: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteNote(noteId);
        deleteNoteFromStore(noteId);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete note');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [deleteNoteFromStore, setLoading, setError]
  );

  return {
    notes,
    selectedNote,
    isLoading,
    error,
    setSelectedNote,
    loadNotes,
    createNote: createNewNote,
    updateNote: updateExistingNote,
    deleteNote: deleteExistingNote,
  };
};
