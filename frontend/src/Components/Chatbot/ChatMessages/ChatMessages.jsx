import React, { useRef, useEffect } from 'react';
import './ChatMessages.css';
import { Bot, User } from 'lucide-react';
import MathRenderer from '../MathRenderer/MathRenderer';

const ChatMessages = ({ messages = [], loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="chat-messages" style={{ overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        
        return (
          <div key={index} className={`message-wrapper ${isUser ? 'user' : 'ai'}`}>
            <div className="message-avatar">
              {isUser ? (
                <div className="avatar user-avatar"><User size={20} /></div>
              ) : (
                <div className="avatar ai-avatar"><Bot size={20} /></div>
              )}
            </div>
            <div className="message-bubble">
              {isUser ? (
                 <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.content}</div>
              ) : (
                 <MathRenderer content={msg.content} />
              )}
            </div>
          </div>
        );
      })}
      
      {loading && (
        <div className="message-wrapper ai">
          <div className="message-avatar">
            <div className="avatar ai-avatar"><Bot size={20} /></div>
          </div>
          <div className="message-bubble">
            <div style={{ 
                fontStyle: 'italic', 
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
              <span className="loading-dots">Bot đang trả lời...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
