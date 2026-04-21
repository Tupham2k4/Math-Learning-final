import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const MathRenderer = ({ content }) => {
  return (
    <div className="math-renderer" style={{ width: '100%', overflowX: 'auto', lineHeight: '1.6' }}>
      <ReactMarkdown
        children={content || ""}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return !inline ? (
              <pre style={{ 
                backgroundColor: '#1f2937', 
                color: '#e5e7eb', 
                padding: '12px', 
                borderRadius: '8px', 
                overflowX: 'auto',
                marginTop: '8px',
                marginBottom: '8px'
              }}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#ef4444', 
                padding: '2px 4px', 
                borderRadius: '4px', 
                fontSize: '0.9em',
                fontFamily: 'monospace'
              }} className={className} {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p style={{ margin: '8px 0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{children}</p>;
          },
          ul({ children }) {
            return <ul style={{ paddingLeft: '24px', margin: '8px 0', listStyleType: 'disc' }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ paddingLeft: '24px', margin: '8px 0', listStyleType: 'decimal' }}>{children}</ol>;
          },
          h1({ children }) {
             return <h1 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '16px 0 8px 0' }}>{children}</h1>;
          },
          h2({ children }) {
             return <h2 style={{ fontSize: '1.25em', fontWeight: 'bold', margin: '14px 0 8px 0' }}>{children}</h2>;
          },
          h3({ children }) {
             return <h3 style={{ fontSize: '1.125em', fontWeight: 'bold', margin: '12px 0 6px 0' }}>{children}</h3>;
          }
        }}
      />
    </div>
  );
};

export default MathRenderer;
