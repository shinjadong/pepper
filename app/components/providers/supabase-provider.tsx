'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '@/app/lib/supabase';
import { Session } from '@supabase/supabase-js';

const Context = createContext<{ session: Session | null }>({ session: null });

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check current session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Context.Provider value={{ session }}>{children}</Context.Provider>;
}

export function useSupabase() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
