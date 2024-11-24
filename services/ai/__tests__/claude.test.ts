import { ClaudeService } from '../claude';
import { EditorContext } from '@/types/ai';

// Mock fetch globally
global.fetch = jest.fn();

describe('ClaudeService', () => {
  let service: ClaudeService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    process.env.CLAUDE_API_KEY = 'test-api-key';
    service = new ClaudeService();
  });

  describe('analyze', () => {
    it('should successfully analyze content', async () => {
      const mockResponse = {
        sentiment: 'positive',
        topics: ['AI', 'testing'],
        summary: 'Test summary',
        suggestions: ['suggestion1'],
        confidence: 0.9,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.analyze('test content');
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/analyze'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'x-api-key': 'test-api-key',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(service.analyze('test content')).rejects.toThrow('API request failed');
    });
  });

  describe('suggest', () => {
    const mockContext: EditorContext = {
      content: 'test content',
      cursorPosition: 0,
      fileType: 'markdown',
    };

    it('should successfully return suggestions', async () => {
      const mockResponse = [
        {
          text: 'suggestion',
          type: 'completion',
          confidence: 0.8,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.suggest(mockContext);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('complete', () => {
    it('should successfully complete prompt', async () => {
      const mockResponse = {
        text: 'completed text',
        confidence: 0.9,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.complete('test prompt');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('constructor', () => {
    it('should throw error when API key is not set', () => {
      process.env.CLAUDE_API_KEY = '';
      expect(() => new ClaudeService()).toThrow('CLAUDE_API_KEY is not set');
    });
  });
});
