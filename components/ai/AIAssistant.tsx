'use client';

import { useState, useCallback } from 'react';
import { Bot, Sparkles, FileText, Brain, Expand, Loader2 } from 'lucide-react';
import { useNoteStore } from '@/app/stores/note-store';
import { toast } from 'sonner';

type AIAction = 'improve' | 'summarize' | 'expand' | 'brainstorm';

interface AIButton {
  action: AIAction;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const aiButtons: AIButton[] = [
  {
    action: 'improve',
    label: 'Improve',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Enhance writing quality',
  },
  {
    action: 'summarize',
    label: 'Summarize',
    icon: <FileText className="w-4 h-4" />,
    description: 'Create a concise summary',
  },
  {
    action: 'expand',
    label: 'Expand',
    icon: <Expand className="w-4 h-4" />,
    description: 'Add more details',
  },
  {
    action: 'brainstorm',
    label: 'Brainstorm',
    icon: <Brain className="w-4 h-4" />,
    description: 'Generate new ideas',
  },
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const currentNote = useNoteStore((state) => state.currentNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  const handleAIAction = useCallback(
    async (action: AIAction, customInput?: string) => {
      if (!currentNote) {
        toast.error('Please select a note first');
        return;
      }

      try {
        setIsLoading(true);

        let prompt = customInput || '';
        if (!customInput) {
          switch (action) {
            case 'improve':
              prompt = 'Please improve this text while maintaining its original meaning:';
              break;
            case 'summarize':
              prompt = 'Please provide a concise summary of this text:';
              break;
            case 'expand':
              prompt = 'Please expand on this text with more details and examples:';
              break;
            case 'brainstorm':
              prompt = 'Please suggest related ideas and concepts based on this text:';
              break;
          }
        }

        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            context: currentNote.content,
            action,
          }),
        });

        if (!response.ok) {
          throw new Error('AI request failed');
        }

        const data = await response.json();

        if (action === 'improve' || action === 'expand') {
          await updateNote(currentNote.id, {
            content: data.content,
            updated_at: new Date().toISOString(),
          });
          toast.success('Note updated successfully');
        } else {
          // For summarize and brainstorm, append the result to the note
          const newContent = `${currentNote.content}\n\n---\n\n**${
            action.charAt(0).toUpperCase() + action.slice(1)
          } Results:**\n\n${data.content}`;
          
          await updateNote(currentNote.id, {
            content: newContent,
            updated_at: new Date().toISOString(),
          });
          toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} results added to note`);
        }

        setCustomPrompt('');
      } catch (error) {
        console.error('AI Assistant error:', error);
        toast.error('Failed to process AI request');
      } finally {
        setIsLoading(false);
      }
    },
    [currentNote, updateNote]
  );

  if (!currentNote) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end space-y-4">
        {isOpen && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-4 mb-2 w-80">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {aiButtons.map((button) => (
                  <button
                    key={button.action}
                    onClick={() => handleAIAction(button.action)}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center p-3 space-y-2 bg-gray-50 dark:bg-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
                    title={button.description}
                  >
                    {button.icon}
                    <span className="text-sm font-medium">{button.label}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Custom prompt..."
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-700 rounded-l-lg border-r border-gray-200 dark:border-zinc-600 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAIAction('improve', customPrompt)}
                    disabled={isLoading || !customPrompt}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            isOpen
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Bot className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
