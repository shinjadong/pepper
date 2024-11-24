import { create } from 'zustand';
import { getClientSession, signIn, signOut } from '@/app/lib/client-session';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  checkAuth: async () => {
    try {
      const session = await getClientSession();
      set({
        isAuthenticated: !!session?.user,
        user: session?.user || null,
        loading: false,
      });
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
  login: async (email: string, password: string) => {
    const { user } = await signIn(email, password);
    set({ isAuthenticated: true, user });
  },
  logout: async () => {
    await signOut();
    set({ isAuthenticated: false, user: null });
  },
}));
