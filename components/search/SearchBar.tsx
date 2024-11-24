'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '@/app/stores/search-store';
import { useNoteStore } from '@/app/stores/note-store';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { searchResults, searchNotes, clearSearch } = useSearchStore();
  const { setCurrentNote } = useNoteStore();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchNotes(debouncedQuery);
      setIsOpen(true);
    } else {
      clearSearch();
      setIsOpen(false);
    }
  }, [debouncedQuery, searchNotes, clearSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectNote = (noteId: string) => {
    const note = searchResults.find((n) => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setIsOpen(false);
      setQuery('');
      clearSearch();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-64 overflow-auto"
        >
          {searchResults.map((note) => (
            <button
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <div className="text-sm font-medium truncate">{note.title}</div>
              {note.content && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {note.content}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
