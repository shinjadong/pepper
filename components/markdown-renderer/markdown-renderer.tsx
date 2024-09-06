import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const MarkdownRenderer = ({ children: content }: { children: string }) => {
  return (
    <ReactMarkdown
      className="prose-sm sm:prose lg:prose-lg xl:prose-xl prose-b"
      remarkPlugins={[remarkGfm]}
      components={{
        code(props: any) {
          const { inline, children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter {...rest} PreTag="div" language={match[1]} style={dracula}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
