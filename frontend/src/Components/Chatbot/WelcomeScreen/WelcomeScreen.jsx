import React from 'react';
import './WelcomeScreen.css';
import { Bot } from 'lucide-react';
import SuggestionBox from '../SuggestionBox/SuggestionBox';

const WelcomeScreen = ({ suggestions, onSelectSuggestion }) => {
  return (
    <div className="welcome-screen" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '24px'
    }}>
      <div className="welcome-icon" style={{ marginBottom: '16px' }}>
        <Bot size={64} color="#3A9D5D" strokeWidth={1.5} />
      </div>
      
      <h1 className="welcome-title" style={{ textAlign: 'center', marginBottom: '16px', fontSize: '24px' }}>
        Chào mừng đến với Chatbot AI Toán học
      </h1>
      
      <p className="welcome-desc" style={{ textAlign: 'center', marginBottom: '32px', color: '#6b7280', maxWidth: '600px' }}>
        Hãy đặt bất kỳ câu hỏi nào về toán học, tôi sẽ giúp bạn giải và hướng dẫn chi tiết từng bước.
      </p>
      
      <div className="welcome-suggestions-wrapper" style={{ width: '100%', maxWidth: '800px' }}>
         <SuggestionBox 
            suggestions={suggestions} 
            onSelectSuggestion={onSelectSuggestion} 
         />
      </div>
    </div>
  );
};

export default WelcomeScreen;
