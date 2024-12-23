'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/types/database';
import type { Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseContext = {
  supabase: ReturnType<typeof createClientComponentClient<Database>>;
  session: Session | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/login');
      }
      router.refresh();
    });

    // 초기 세션 설정
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};

export const useSupabaseSession = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabaseSession must be used inside SupabaseProvider');
  }
  return context.session;
};