import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Block } from '@/types';

interface PepperDB extends DBSchema {
  blocks: {
    key: string;
    value: Block & {
      syncStatus: 'synced' | 'pending' | 'failed';
      lastSynced?: number;
    };
    indexes: {
      'by-sync-status': string;
      'by-parent': string;
      'by-updated': number;
    };
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      operation: 'create' | 'update' | 'delete';
      data?: Block;
      timestamp: number;
      retryCount: number;
    };
    indexes: {
      'by-timestamp': number;
    };
  };
}

let db: IDBPDatabase<PepperDB>;

export async function initDB() {
  db = await openDB<PepperDB>('pepper', 1, {
    upgrade(db) {
      // 블록 저장소
      const blockStore = db.createObjectStore('blocks', {
        keyPath: 'id',
      });
      blockStore.createIndex('by-sync-status', 'syncStatus');
      blockStore.createIndex('by-parent', 'parentId');
      blockStore.createIndex('by-updated', 'updatedAt');

      // 동기화 큐
      const syncStore = db.createObjectStore('syncQueue', {
        keyPath: 'id',
      });
      syncStore.createIndex('by-timestamp', 'timestamp');
    },
  });
}

// 블록 CRUD
export async function getBlock(id: string) {
  await ensureDB();
  return db.get('blocks', id);
}

export async function getAllBlocks() {
  await ensureDB();
  return db.getAll('blocks');
}

export async function getBlocksByParent(parentId: string | null) {
  await ensureDB();
  const index = db.transaction('blocks').store.index('by-parent');
  return index.getAll(parentId);
}

export async function saveBlock(block: Block) {
  await ensureDB();
  const existing = await getBlock(block.id);
  const syncStatus = existing ? existing.syncStatus : 'pending';
  
  await db.put('blocks', {
    ...block,
    syncStatus,
    lastSynced: existing?.lastSynced,
  });

  // 동기화 큐에 추가
  await addToSyncQueue({
    id: block.id,
    operation: existing ? 'update' : 'create',
    data: block,
    timestamp: Date.now(),
    retryCount: 0,
  });
}

export async function deleteBlock(id: string) {
  await ensureDB();
  await db.delete('blocks', id);

  // 동기화 큐에 추가
  await addToSyncQueue({
    id,
    operation: 'delete',
    timestamp: Date.now(),
    retryCount: 0,
  });
}

// 동기화 큐 관리
export async function addToSyncQueue(item: PepperDB['syncQueue']['value']) {
  await ensureDB();
  await db.add('syncQueue', item);
}

export async function getSyncQueue() {
  await ensureDB();
  const index = db.transaction('syncQueue').store.index('by-timestamp');
  return index.getAll();
}

export async function removeFromSyncQueue(id: string) {
  await ensureDB();
  await db.delete('syncQueue', id);
}

// 동기화 상태 업데이트
export async function markAsSynced(id: string) {
  await ensureDB();
  const block = await getBlock(id);
  if (block) {
    await db.put('blocks', {
      ...block,
      syncStatus: 'synced',
      lastSynced: Date.now(),
    });
  }
}

export async function markAsFailed(id: string) {
  await ensureDB();
  const block = await getBlock(id);
  if (block) {
    await db.put('blocks', {
      ...block,
      syncStatus: 'failed',
    });
  }
}

// 유틸리티
async function ensureDB() {
  if (!db) {
    await initDB();
  }
}
