'use client';

import { ThemeProvider } from 'next-themes';
import { SupabaseProvider } from './supabase-provider';
import { RealtimeProvider } from './realtime-provider';
import { SidebarProvider } from '@/app/context/sidebar-context';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <SupabaseProvider>
          <RealtimeProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster position="bottom-right" />
          </RealtimeProvider>
        </SupabaseProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
