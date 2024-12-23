import { create } from 'zustand';
import { Block } from '@/types';
import { supabaseClient } from '@/app/lib/supabase';
import { toast } from 'sonner';

interface BlockStore {
  blocks: Block[];
  selectedBlockId: string | null;
  setBlocks: (blocks: Block[]) => void;
  setSelectedBlock: (blockId: string | null) => void;
  addBlock: (pageId: string, type: Block['type'], position: number) => Promise<() => void>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  moveBlock: (blockId: string, fromIndex: number, toIndex: number) => Promise<void>;
}

export const useBlockStore = create<BlockStore>((set, get) => ({
  blocks: [],
  selectedBlockId: null,

  setBlocks: (blocks) => set({ blocks }),
  
  setSelectedBlock: (blockId) => set({ selectedBlockId: blockId }),

  addBlock: async (pageId, type, position) => {
    try {
      // 낙관적 업데이트
      const newBlock: Block = {
        id: crypto.randomUUID(),
        type,
        content: { text: '' },
        page_id: pageId,
        parent_block_id: null,
        position,
        properties: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 위치를 만들기 위해 기존 블록들의 position 업데이트
      const updatedBlocks = get().blocks.map((block) =>
        block.position >= position
          ? { ...block, position: block.position + 1 }
          : block
      );

      set({
        blocks: [...updatedBlocks, newBlock],
        selectedBlockId: newBlock.id,
      });

      // Supabase에 저장
      const { error } = await supabaseClient.from('blocks').insert([newBlock]);

      if (error) {
        throw error;
      }

      // 실시간 업데이트를 위한 구독
      const channel = supabaseClient
        .channel('blocks')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'blocks',
            filter: `page_id=eq.${pageId}`,
          },
          async (payload) => {
            const { data: blocks } = await supabaseClient
              .from('blocks')
              .select('*')
              .eq('page_id', pageId)
              .order('position');
            
            if (blocks) {
              set({ blocks });
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      console.error('Failed to add block:', error);
      toast.error('블록을 추가하는데 실패했습니다.');
    }
  },

  updateBlock: async (blockId, updates) => {
    try {
      // 낙관적 업데이트
      const updatedBlocks = get().blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      set({ blocks: updatedBlocks });

      // Supabase에 저장
      const { error } = await supabaseClient
        .from('blocks')
        .update(updates)
        .eq('id', blockId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to update block:', error);
      toast.error('블록을 수정하는데 실패했습니다.');
    }
  },

  deleteBlock: async (blockId) => {
    try {
      // 낙관적 업데이트
      const deletedBlock = get().blocks.find((block) => block.id === blockId);
      if (!deletedBlock) return;

      const updatedBlocks = get().blocks
        .filter((block) => block.id !== blockId)
        .map((block) =>
          block.position > deletedBlock.position
            ? { ...block, position: block.position - 1 }
            : block
        );

      set({ blocks: updatedBlocks });

      // Supabase에서 삭제
      const { error } = await supabaseClient
        .from('blocks')
        .delete()
        .eq('id', blockId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to delete block:', error);
      toast.error('블록을 삭제하는데 실패했습니다.');
    }
  },

  moveBlock: async (blockId, fromIndex, toIndex) => {
    try {
      // 낙관적 업데이트
      const blocks = [...get().blocks];
      const [movedBlock] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, movedBlock);

      // position 업데이트
      const updatedBlocks = blocks.map((block, index) => ({
        ...block,
        position: index,
      }));

      set({ blocks: updatedBlocks });

      // Supabase에 저장
      const { error } = await supabaseClient.from('blocks').upsert(
        updatedBlocks.map(({ id, position }) => ({
          id,
          position,
          updated_at: new Date().toISOString(),
        }))
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to move block:', error);
      toast.error('블록을 이동하는데 실패했습니다.');
    }
  },
}));
