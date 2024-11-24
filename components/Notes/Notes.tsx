'use client';

import { useState, useEffect } from 'react';
import { BaseNote } from '@/types';
import { supabase } from '@/app/lib/supabase';
import { useSupabaseSession } from '@/app/components/providers/supabase-provider';
import { useFolderStore } from '@/app/stores/folder-store';
import { useNoteStore } from '@/app/stores/note-store';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export function Notes() {
  const [notes, setNotes] = useState<BaseNote[]>([]);
  const { session } = useSupabaseSession();
  const { selectedFolder } = useFolderStore();
  const { selectedNote, setSelectedNote } = useNoteStore();

  useEffect(() => {
    if (session?.user?.id && selectedFolder) {
      loadNotes();
    }
  }, [session, selectedFolder]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('folder_id', selectedFolder?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      setSelectedNote(null);
    } catch (error: any) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
    }
  };

  const createNote = async () => {
    if (!session?.user?.id || !selectedFolder) {
      toast.error('Please select a folder first');
      return;
    }

    try {
      const title = prompt('Enter note title:');
      if (!title) return;

      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content: '',
            folder_id: selectedFolder.id,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setSelectedNote(data);
      toast.success('Note created successfully');
    } catch (error: any) {
      console.error('Error creating note:', error);
      toast.error(error.message || 'Failed to create note');
    }
  };

  const handleNoteClick = (note: BaseNote) => {
    setSelectedNote(selectedNote?.id === note.id ? null : note);
  };

  if (!selectedFolder) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notes</h2>
        <button
          onClick={createNote}
          className="p-2 hover:bg-zinc-700 rounded-full"
          title="Create new note"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-center">No notes yet</p>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleNoteClick(note)}
              className={`w-full p-3 text-left rounded flex items-center gap-3 ${
                selectedNote?.id === note.id ? 'bg-zinc-700' : 'hover:bg-zinc-700'
              }`}
            >
              <FileText size={16} />
              <div>
                <div className="font-medium">{note.title}</div>
                <div className="text-sm text-gray-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
