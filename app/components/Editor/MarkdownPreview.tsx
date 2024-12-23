'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = React.memo(({ content }: MarkdownPreviewProps) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // 이미지 최적화
          img({ src, alt, ...props }) {
            if (!src) return null;
            return (
              <img src={src} alt={alt} loading="lazy" className="rounded-lg shadow-lg" {...props} />
            );
          },
          // 링크 최적화
          a({ href, children, ...props }) {
            const isInternal = href?.startsWith('[[') && href?.endsWith(']]');
            if (isInternal) {
              const linkText = href.slice(2, -2);
              return (
                <button
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => {
                    // 내부 링크 처리 로직
                    console.log('Internal link clicked:', linkText);
                  }}
                  {...props}
                >
                  {children}
                </button>
              );
            }
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                {...props}
              >
                {children}
              </a>
            );
          },
          // 체크박스 최적화
          input({ type, checked, ...props }) {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';

export default MarkdownPreview;
