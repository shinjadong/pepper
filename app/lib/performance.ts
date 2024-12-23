// 메모이제이션을 위한 LRU 캐시
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly capacity: number;

  constructor(capacity: number) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // 캐시 히트 시 항목을 맨 앞으로 이동
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 캐시가 가득 찬 경우 가장 오래된 항목 제거
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

// 디바운스 함수
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 쓰로틀 함수
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let waiting = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// 메모이제이션 함수
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  capacity: number = 100
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new LRUCache<string, ReturnType<T>>(capacity);

  return function executedFunction(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const cachedResult = cache.get(key);

    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = func(...args);
    cache.put(key, result);
    return result;
  };
}

// 성능 측정 데코레이터
export function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    
    console.log(
      `Method ${propertyKey} took ${Math.round(end - start)}ms to execute`
    );

    return result;
  };

  return descriptor;
}

// 웹 워커 생성 함수
export function createWorker(fn: Function): Worker {
  const blob = new Blob([`(${fn.toString()})()`], {
    type: 'application/javascript',
  });
  return new Worker(URL.createObjectURL(blob));
}

// 이미지 프리로드
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// 리소스 프리페치
export function prefetchResource(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}
