import { AnalysisResult, EditorContext, Suggestion, Completion } from '@/types/ai';

export class ClaudeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    this.baseUrl = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1';

    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY is not set in environment variables');
    }
  }

  async analyze(content: string): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in analyze:', error);
      throw error;
    }
  }

  async suggest(context: EditorContext): Promise<Suggestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suggest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in suggest:', error);
      throw error;
    }
  }

  async complete(prompt: string): Promise<Completion> {
    try {
      const response = await fetch(`${this.baseUrl}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in complete:', error);
      throw error;
    }
  }
}
