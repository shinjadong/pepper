import { createHash } from 'crypto';
import { AIResponseCache, CacheKeyParams, CacheOptions } from '@/types/cache';
import { MemoryCache } from './MemoryCache';
import { AnalysisResult, Suggestion, Completion } from '@/types/ai';

export class AICache {
  private cache: AIResponseCache;
  private options: CacheOptions;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 30 * 60 * 1000, // 30 minutes
      maxSize: options.maxSize ?? 500,
    };

    this.cache = {
      analysis: new MemoryCache({ ...this.options, namespace: 'analysis' }),
      suggestions: new MemoryCache({ ...this.options, namespace: 'suggestions' }),
      completions: new MemoryCache({ ...this.options, namespace: 'completions' }),
    };
  }

  private generateKey({ type, content, context = {} }: CacheKeyParams): string {
    const data = JSON.stringify({ content, context });
    return createHash('sha256').update(data).digest('hex');
  }

  async getAnalysis(params: CacheKeyParams): Promise<AnalysisResult | null> {
    const key = this.generateKey(params);
    return this.cache.analysis.get<AnalysisResult>(key);
  }

  async getSuggestions(params: CacheKeyParams): Promise<Suggestion[] | null> {
    const key = this.generateKey(params);
    return this.cache.suggestions.get<Suggestion[]>(key);
  }

  async getCompletion(params: CacheKeyParams): Promise<Completion | null> {
    const key = this.generateKey(params);
    return this.cache.completions.get<Completion>(key);
  }

  async setAnalysis(params: CacheKeyParams, result: AnalysisResult): Promise<void> {
    const key = this.generateKey(params);
    await this.cache.analysis.set(key, result);
  }

  async setSuggestions(params: CacheKeyParams, suggestions: Suggestion[]): Promise<void> {
    const key = this.generateKey(params);
    await this.cache.suggestions.set(key, suggestions);
  }

  async setCompletion(params: CacheKeyParams, completion: Completion): Promise<void> {
    const key = this.generateKey(params);
    await this.cache.completions.set(key, completion);
  }

  async clearAll(): Promise<void> {
    await Promise.all([
      this.cache.analysis.clear(),
      this.cache.suggestions.clear(),
      this.cache.completions.clear(),
    ]);
  }

  async getStats() {
    const [analysis, suggestions, completions] = await Promise.all([
      this.cache.analysis.getStats(),
      this.cache.suggestions.getStats(),
      this.cache.completions.getStats(),
    ]);

    return {
      analysis,
      suggestions,
      completions,
      total: {
        hits: analysis.hits + suggestions.hits + completions.hits,
        misses: analysis.misses + suggestions.misses + completions.misses,
        size: analysis.size + suggestions.size + completions.size,
      },
    };
  }
}
