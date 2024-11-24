export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  namespace?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export interface CacheStorage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  getStats(): Promise<CacheStats>;
}

export interface AIResponseCache {
  analysis: CacheStorage;
  suggestions: CacheStorage;
  completions: CacheStorage;
}

export type CacheKey = string;

export interface CacheKeyParams {
  type: 'analysis' | 'suggestion' | 'completion';
  content: string;
  context?: Record<string, any>;
}

export type CacheKeyGenerator = (params: CacheKeyParams) => CacheKey;
