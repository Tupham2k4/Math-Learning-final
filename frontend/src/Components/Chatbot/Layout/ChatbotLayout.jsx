import React from 'react';
import './ChatbotLayout.css';
import Header from '../Header/Header';
import ChatHistory from '../ChatHistory/ChatHistory';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import ChatMessages from '../ChatMessages/ChatMessages';
import ChatInput from '../ChatInput/ChatInput';
import useChatbot from '../../../hooks/useChatbot';

const ChatbotLayout = () => {
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    suggestions,
    fetchMessages,
    createNewConversation,
    handleSendMessage,
    handleDeleteConversation
  } = useChatbot();

  return (
    <div className="chatbot-page-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="chatbot-container" style={{ flex: 1, overflow: 'hidden' }}>
        <aside className="chatbot-sidebar">
          <ChatHistory 
            conversations={conversations} 
            selectedConversation={selectedConversation}
            onSelectConversation={fetchMessages}
            onDeleteConversation={handleDeleteConversation}
            onNewChat={createNewConversation}
          />
        </aside>
        
        <main className="chatbot-main">
          <div className="chat-content-area" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {!selectedConversation || messages.length === 0 ? (
              <WelcomeScreen 
                suggestions={suggestions} 
                onSelectSuggestion={handleSendMessage} 
              />
            ) : (
              <ChatMessages 
                messages={messages} 
                loading={loading}
              />
            )}
          </div>
          
          <div className="chat-input-area">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              loading={loading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotLayout;
