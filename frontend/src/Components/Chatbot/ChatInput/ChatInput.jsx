import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';
import { Send, Camera, Sigma, X } from 'lucide-react';
import 'mathlive';

const ChatInput = ({ onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const [isMathMode, setIsMathMode] = useState(false);
  const textareaRef = useRef(null);
  const mathFieldRef = useRef(null);

  useEffect(() => {
    if (isMathMode && mathFieldRef.current) {
      mathFieldRef.current.focus();
      
      const handleChange = (e) => {
        setInput(e.target.value);
      };

      const currentMf = mathFieldRef.current;
      currentMf.addEventListener('input', handleChange);
      return () => {
        currentMf.removeEventListener('input', handleChange);
      };
    }
  }, [isMathMode]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isMathMode && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift + Enter sẽ thực hiện xuống dòng auto của textarea
  };

  const handleSend = () => {
    if (input.trim() && !loading) {
      const content = isMathMode ? `$$${input}$$` : input;
      if (onSendMessage) {
        onSendMessage(content);
      }
      setInput('');
      setIsMathMode(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const toggleMathMode = () => {
    if(loading) return;
    setIsMathMode(!isMathMode);
    setInput('');
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="chat-input-container">
      {isMathMode && (
        <div className="math-mode-badge">
          <span>Đang ở chế độ nhập công thức</span>
          <button onClick={toggleMathMode} className="close-math-btn"><X size={14} /></button>
        </div>
      )}
      <div className={`chat-input-wrapper ${isMathMode ? 'math-mode' : ''} ${loading ? 'disabled' : ''}`}>
        {!isMathMode && (
          <button 
            className="input-action-btn fx-btn" 
            onClick={toggleMathMode}
            title="Nhập công thức toán"
            disabled={loading}
          >
            <Sigma size={20} />
          </button>
        )}
        
        {isMathMode ? (
          <math-field
            ref={mathFieldRef}
            class="chat-math-field"
            virtual-keyboard-mode="onfocus"
            disabled={loading ? "true" : undefined}
          >
            {input}
          </math-field>
        ) : (
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            rows="1"
            placeholder="Hỏi bài toán, công thức, đạo hàm, tích phân..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        )}
        
        <div className="chat-input-btns">
          <button className="input-action-btn upload-btn" title="Upload ảnh bài toán" disabled={loading}>
            <Camera size={20} />
          </button>
          <button 
            className={`send-btn ${input.trim() && !loading ? 'active' : ''}`} 
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
