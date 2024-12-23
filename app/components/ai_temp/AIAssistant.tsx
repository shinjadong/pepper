import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/app/stores/auth-store';
import { useRouter } from 'next/navigation';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestion: (suggestion: string) => void;
  noteContent?: string;
}

type MessageType = 'suggestion' | 'enhance' | 'tags' | 'analyze';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type: string;
  timestamp?: number;
}

export function AIAssistant({ isOpen, onClose, onSuggestion, noteContent }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    // 로컬 스토리지에서 이전 대화 불러오기
    const saved = localStorage.getItem('ai_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 메시지 변경시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (type: string = 'suggestion') => {
    if (!message.trim() && type === 'suggestion') return;
    setError(null);

    try {
      setLoading(true);
      const newMessage: Message = {
        role: 'user',
        content: message,
        type,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);

      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          type,
          noteContent: type !== 'suggestion' ? noteContent || message : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI suggestion');
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.content,
        type,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 'apply' 버튼을 클릭할 때만 노트에 적용하도록 수정
    } catch (error: any) {
      console.error('Error getting AI suggestion:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleApplyToNote = (content: string) => {
    onSuggestion(content);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('ai_chat_history');
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`fixed right-4 bottom-4 w-96 bg-white rounded-lg shadow-lg ${isOpen ? '' : 'hidden'}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please sign in to use the AI assistant</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed right-4 bottom-4 w-96 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 ${isOpen ? '' : 'hidden'}`}
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleApplyToNote(msg.content)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Apply to Note
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p>Thinking...</p>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => handleSendMessage('enhance')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            disabled={loading}
          >
            Enhance
          </button>
          <button
            onClick={() => handleSendMessage('tags')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            disabled={loading}
          >
            Suggest Tags
          </button>
          <button
            onClick={() => handleSendMessage('analyze')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            disabled={loading}
          >
            Analyze
          </button>
          <button
            onClick={clearHistory}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Clear
          </button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 p-2 border rounded"
            disabled={loading || !isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}
