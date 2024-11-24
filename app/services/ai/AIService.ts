import Anthropic from '@anthropic-ai/sdk';
import { getSession } from '@/app/lib/session';

export class AIService {
  private static anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  private static async validateSession() {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }
    return session.user.id;
  }

  static async generateSuggestion(prompt: string) {
    await this.validateSession();

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const response = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.content[0].text;
  }

  static async enhanceNote(content: string) {
    await this.validateSession();
    return this.generateSuggestion(
      `Please enhance the following note content with additional details and formatting:\n\n${content}`
    );
  }

  static async suggestTags(content: string) {
    await this.validateSession();
    return this.generateSuggestion(
      `Please suggest relevant tags for the following note content:\n\n${content}`
    );
  }

  static async analyzeNote(content: string) {
    await this.validateSession();
    return this.generateSuggestion(`Please analyze this note and provide insights:\n\n${content}`);
  }
}
