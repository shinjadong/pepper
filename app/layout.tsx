import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootProvider } from './components/providers/root-provider';
import { DragAndDropProvider } from './components/providers/dnd-provider';
import { SidebarProvider } from './context/sidebar-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pepper',
  description: 'Block-based editor for real-time collaboration',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <RootProvider>
          <DragAndDropProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </DragAndDropProvider>
        </RootProvider>
      </body>
    </html>
  );
}
