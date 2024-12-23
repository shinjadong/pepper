'use client';

import { SupabaseProvider } from './supabase-provider';
import { ThemeProvider } from 'next-themes';

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  );
}
