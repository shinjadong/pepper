import { Editor } from '@tiptap/react';
import { Configuration, OpenAIApi } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';

export class AIAssistant {
  private openai: OpenAIApi;
  private claude: Anthropic;
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
    this.claude = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async processCommand(command: string) {
    const selection = this.editor.state.selection;
    const context = this.editor.getHTML();

    // AI 응답 처리
    const response = await this.claude.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Context: ${context}\nSelection: ${selection}\nCommand: ${command}`,
        },
      ],
    });

    // 에디터에 변경사항 적용
    this.editor.commands.setContent(response.content);
  }
}
