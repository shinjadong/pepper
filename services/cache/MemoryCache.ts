import { CacheEntry, CacheOptions, CacheStats, CacheStorage } from '@/types/cache';

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_SIZE = 1000;

export class MemoryCache implements CacheStorage {
  private cache: Map<string, CacheEntry<any>>;
  private stats: CacheStats;
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
    };
    this.options = {
      ttl: options.ttl ?? DEFAULT_TTL,
      maxSize: options.maxSize ?? DEFAULT_MAX_SIZE,
      namespace: options.namespace ?? 'default',
    };
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.stats.size--;
      }
    }
  }

  private enforceMaxSize(): void {
    if (this.stats.size <= this.options.maxSize) return;

    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    );

    while (this.stats.size > this.options.maxSize && entries.length > 0) {
      const [key] = entries.shift()!;
      this.cache.delete(key);
      this.stats.size--;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.size--;
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl ?? this.options.ttl;
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      key,
    };

    this.cache.set(key, entry);
    this.stats.size++;

    this.cleanup();
    this.enforceMaxSize();
  }

  async delete(key: string): Promise<void> {
    if (this.cache.delete(key)) {
      this.stats.size--;
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.size = 0;
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.size--;
      return false;
    }
    return true;
  }

  async getStats(): Promise<CacheStats> {
    const entries = Array.from(this.cache.values());
    return {
      ...this.stats,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map((e) => e.timestamp)) : undefined,
      newestEntry: entries.length > 0 ? Math.max(...entries.map((e) => e.timestamp)) : undefined,
    };
  }
}
