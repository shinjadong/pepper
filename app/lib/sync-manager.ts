import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  getSyncQueue,
  removeFromSyncQueue,
  markAsSynced,
  markAsFailed,
} from './indexed-db';
import { toast } from 'sonner';

const RETRY_DELAY = 5000; // 5초
const MAX_RETRIES = 3;

class SyncManager {
  private supabase = createClientComponentClient();
  private isRunning = false;
  private syncInterval: NodeJS.Timeout | null = null;

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // 주기적으로 동기화 시도
    this.syncInterval = setInterval(() => {
      this.processSyncQueue().catch(console.error);
    }, RETRY_DELAY);

    // 첫 실행
    await this.processSyncQueue();

    // 온라인/오프라인 상태 모니터링
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  stop() {
    this.isRunning = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    toast.success('온라인 상태로 전환되었습니다.');
    this.processSyncQueue().catch(console.error);
  };

  private handleOffline = () => {
    toast.error('오프라인 상태로 전환되었습니다. 변경사항이 로컬에 저장됩니다.');
  };

  private async processSyncQueue() {
    if (!navigator.onLine) return;

    const queue = await getSyncQueue();
    for (const item of queue) {
      try {
        switch (item.operation) {
          case 'create':
          case 'update':
            if (!item.data) continue;
            
            const { error: upsertError } = await this.supabase
              .from('blocks')
              .upsert(item.data);

            if (upsertError) throw upsertError;
            break;

          case 'delete':
            const { error: deleteError } = await this.supabase
              .from('blocks')
              .delete()
              .eq('id', item.id);

            if (deleteError) throw deleteError;
            break;
        }

        // 성공적으로 동기화됨
        await markAsSynced(item.id);
        await removeFromSyncQueue(item.id);
      } catch (error) {
        console.error('Sync error:', error);

        if (item.retryCount >= MAX_RETRIES) {
          // 최대 재시도 횟수 초과
          await markAsFailed(item.id);
          await removeFromSyncQueue(item.id);
          toast.error(`${item.id} 블록 동기화에 실패했습니다.`);
        } else {
          // 재시도 횟수 증가
          const updatedItem = {
            ...item,
            retryCount: item.retryCount + 1,
            timestamp: Date.now(),
          };
          await removeFromSyncQueue(item.id);
          await this.addToSyncQueue(updatedItem);
        }
      }
    }
  }

  private async addToSyncQueue(item: any) {
    const { error } = await this.supabase.from('sync_queue').insert(item);
    if (error) {
      console.error('Error adding to sync queue:', error);
    }
  }
}

// 싱글톤 인스턴스
export const syncManager = new SyncManager();
