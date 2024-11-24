import { AICache } from '../AICache';
import { CacheKeyParams } from '@/types/cache';
import { AnalysisResult, Suggestion, Completion } from '@/types/ai';

describe('AICache', () => {
  let cache: AICache;

  beforeEach(() => {
    cache = new AICache({ ttl: 100 }); // 100ms TTL for testing
  });

  const mockParams: CacheKeyParams = {
    type: 'analysis',
    content: 'test content',
    context: { fileType: 'markdown' },
  };

  const mockAnalysis: AnalysisResult = {
    type: 'analysis',
    content: 'test content',
    score: 0.9,
    entities: [],
  };

  const mockSuggestions: Suggestion[] = [
    {
      text: 'test suggestion',
      type: 'completion',
      confidence: 0.8,
    },
  ];

  const mockCompletion: Completion = {
    text: 'test completion',
    confidence: 0.9,
  };

  it('caches and retrieves analysis results', async () => {
    await cache.setAnalysis(mockParams, mockAnalysis);
    const result = await cache.getAnalysis(mockParams);
    expect(result).toEqual(mockAnalysis);
  });

  it('caches and retrieves suggestions', async () => {
    await cache.setSuggestions(mockParams, mockSuggestions);
    const result = await cache.getSuggestions(mockParams);
    expect(result).toEqual(mockSuggestions);
  });

  it('caches and retrieves completions', async () => {
    await cache.setCompletion(mockParams, mockCompletion);
    const result = await cache.getCompletion(mockParams);
    expect(result).toEqual(mockCompletion);
  });

  it('returns null for expired entries', async () => {
    await cache.setAnalysis(mockParams, mockAnalysis);
    await new Promise((resolve) => setTimeout(resolve, 150)); // Wait for TTL
    const result = await cache.getAnalysis(mockParams);
    expect(result).toBeNull();
  });

  it('clears all caches', async () => {
    await cache.setAnalysis(mockParams, mockAnalysis);
    await cache.setSuggestions(mockParams, mockSuggestions);
    await cache.setCompletion(mockParams, mockCompletion);

    await cache.clearAll();

    expect(await cache.getAnalysis(mockParams)).toBeNull();
    expect(await cache.getSuggestions(mockParams)).toBeNull();
    expect(await cache.getCompletion(mockParams)).toBeNull();
  });

  it('generates different keys for different contexts', async () => {
    const params1 = { ...mockParams, context: { fileType: 'markdown' } };
    const params2 = { ...mockParams, context: { fileType: 'typescript' } };

    await cache.setAnalysis(params1, mockAnalysis);
    await cache.setAnalysis(params2, { ...mockAnalysis, score: 0.8 });

    const result1 = await cache.getAnalysis(params1);
    const result2 = await cache.getAnalysis(params2);

    expect(result1?.score).toBe(0.9);
    expect(result2?.score).toBe(0.8);
  });

  it('provides accurate cache statistics', async () => {
    await cache.setAnalysis(mockParams, mockAnalysis);
    await cache.getAnalysis(mockParams); // Hit
    await cache.getAnalysis({ ...mockParams, content: 'missing' }); // Miss

    const stats = await cache.getStats();
    expect(stats.analysis.hits).toBe(1);
    expect(stats.analysis.misses).toBe(1);
    expect(stats.analysis.size).toBe(1);
  });
});
