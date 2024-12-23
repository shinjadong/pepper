import { create } from 'zustand';
import { Note } from '../types';

interface RenameDialogStore {
  isOpen: boolean;
  note: Note | null;
  openRenameDialog: (note: Note) => void;
  closeRenameDialog: () => void;
}

export const useRenameDialog = create<RenameDialogStore>((set) => ({
  isOpen: false,
  note: null,
  openRenameDialog: (note) => set({ isOpen: true, note }),
  closeRenameDialog: () => set({ isOpen: false, note: null }),
}));
