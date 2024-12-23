const manifest = {
  id: 'translate',
  name: '번역',
  description: '텍스트를 다른 언어로 번역합니다.',
  version: '1.0.0',
  author: 'Pepper Team',
  permissions: ['network'],
};

export default {
  manifest,
  async activate(context) {
    console.log('Translate plugin activated');
  },
  async deactivate() {
    console.log('Translate plugin deactivated');
  },
  commands: [
    {
      id: 'translate',
      name: '번역',
      description: '선택한 텍스트를 번역합니다.',
      keybinding: 'ctrl+t',
      async handler(context) {
        const block = await context.getSelectedBlock();
        if (!block || block.type !== 'text') return;

        const text = block.content.text;
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${context.settings.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: text,
              target: context.settings.targetLanguage || 'en',
            }),
          }
        );

        const { data } = await response.json();
        const translatedText = data.translations[0].translatedText;

        await context.updateBlock(block.id, {
          content: {
            ...block.content,
            text: translatedText,
          },
        });

        context.showNotification('번역이 완료되었습니다.', 'success');
      },
    },
  ],
};
