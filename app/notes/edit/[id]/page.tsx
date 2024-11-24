'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export default function EditNote({ params: { id } }: { params: { id: string } }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    // id를 사용한 노트 로딩 로직
    const loadNote = async () => {
      // 노트 로딩 로직
    };
    loadNote();
  }, [id]);

  return (
    <div className="flex h-full">
      <div className="w-1/2 p-4 border-r border-zinc-700">
        <textarea
          className="w-full h-full bg-zinc-800 text-white p-4 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your markdown here..."
        />
      </div>
      <div className="w-1/2 p-4 prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ className, children, ...props }: CodeBlockProps) => {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  {...props}
                  style={tomorrow as any}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
