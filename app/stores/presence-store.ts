import { create } from 'zustand';
import { supabaseClient } from '@/app/lib/supabase';

export interface User {
  id: string;
  name: string;
  avatar_url: string;
  color: string;
}

export interface Presence {
  user: User;
  blockId: string | null;
  lastSeen: string;
}

interface PresenceStore {
  users: Map<string, Presence>;
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  updatePresence: (blockId: string | null) => void;
  subscribeToPresence: (pageId: string) => () => void;
}

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
];

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  users: new Map(),
  currentUser: null,

  setCurrentUser: (user) => {
    // 랜덤 색상 할당
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    set({ currentUser: { ...user, color } });
  },

  updatePresence: async (blockId) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    try {
      await supabaseClient.from('presence').upsert({
        user_id: currentUser.id,
        block_id: blockId,
        last_seen: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  },

  subscribeToPresence: (pageId) => {
    const channel = supabaseClient
      .channel(`presence:${pageId}`)
      .on(
        'presence',
        { event: 'sync' },
        () => {
          const state = channel.presenceState<Presence>();
          const users = new Map(
            Object.entries(state).map(([id, [presence]]) => [id, presence])
          );
          set({ users });
        }
      )
      .on(
        'presence',
        { event: 'join' },
        ({ key, newPresence }) => {
          set((state) => {
            const users = new Map(state.users);
            users.set(key, newPresence[0]);
            return { users };
          });
        }
      )
      .on(
        'presence',
        { event: 'leave' },
        ({ key }) => {
          set((state) => {
            const users = new Map(state.users);
            users.delete(key);
            return { users };
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },
}));
