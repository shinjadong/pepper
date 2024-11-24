'use client';

import { MarkdownEditor } from '@/components/Editor/MarkdownEditor';
import { Sidebar } from '@/components/sidebar/Sidebar';

export function HomeClient() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <MarkdownEditor />
    </main>
  );
}
