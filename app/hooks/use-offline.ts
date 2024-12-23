'use client';

import { useState, useEffect } from 'react';
import { syncManager } from '@/lib/sync-manager';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // 초기 상태 설정
    setIsOffline(!navigator.onLine);

    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 동기화 관리자 시작
    syncManager.start();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      syncManager.stop();
    };
  }, []);

  // 보류 중인 변경사항 확인
  useEffect(() => {
    const checkPendingChanges = async () => {
      try {
        const { data: pendingBlocks } = await fetch('/api/blocks/pending').then(
          (res) => res.json()
        );
        setHasPendingChanges(pendingBlocks.length > 0);
      } catch (error) {
        console.error('Error checking pending changes:', error);
      }
    };

    if (!isOffline) {
      checkPendingChanges();
    }
  }, [isOffline]);

  return {
    isOffline,
    hasPendingChanges,
  };
}
