'use client';

import { Editor } from '@/app/components/editor/Editor';
import { useEffect, useState } from 'react';
import { Page } from '@/types';
import { supabase } from '@/app/lib/supabase';
import { useParams } from 'next/navigation';

export default function PageView() {
  const params = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!params.id) return;

      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', params.id)
        .single();

      if (pageError) {
        console.error('Error fetching page:', pageError);
        return;
      }

      const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', params.id)
        .order('position');

      if (blocksError) {
        console.error('Error fetching blocks:', blocksError);
        return;
      }

      setPage({
        ...pageData,
        blocks: blocksData || [],
      });
      setIsLoading(false);
    };

    fetchPage();
  }, [params.id]);

  const handleBlocksChange = async (blocks: Page['blocks']) => {
    if (!page) return;

    try {
      const { error } = await supabase.from('blocks').upsert(
        blocks.map((block) => ({
          ...block,
          page_id: page.id,
        }))
      );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving blocks:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">페이지를 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <input
          type="text"
          className="mb-8 w-full bg-transparent text-4xl font-bold focus:outline-none"
          value={page.title}
          onChange={async (e) => {
            const newTitle = e.target.value;
            setPage((prev) => (prev ? { ...prev, title: newTitle } : null));
            await supabase
              .from('pages')
              .update({ title: newTitle })
              .eq('id', page.id);
          }}
        />
        <Editor page={page} onChange={handleBlocksChange} />
      </div>
    </div>
  );
}
