import React from 'react';
import './ChatHistory.css';
import { MessageSquare, Clock, Trash2 } from 'lucide-react';

const ChatHistory = ({ 
  conversations = [], 
  selectedConversation, 
  onSelectConversation, 
  onDeleteConversation,
  onNewChat 
}) => {

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-history">
      <button className="new-chat-btn" onClick={onNewChat}>
        <span className="plus-icon">+</span> Cuộc trò chuyện mới
      </button>
      
      <div className="history-section">
        <h3 className="history-title">Lịch sử trò chuyện</h3>
        
        <div className="history-list">
          {!conversations || conversations.length === 0 ? (
            <div className="empty-history">Chưa có lịch sử</div>
          ) : (
            conversations.map((conversation) => (
              <div 
                key={conversation._id} 
                className={`history-item ${selectedConversation === conversation._id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation._id)}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <MessageSquare size={16} className="history-item-icon" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div className="history-item-content" style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                      <div className="history-item-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conversation.title || 'Cuộc trò chuyện'}
                      </div>
                      
                      {conversation.lastMessage && (
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            marginTop: '2px'
                          }}>
                              {conversation.lastMessage}
                          </div>
                      )}

                      <div className="history-item-time" style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} /> {formatTime(conversation.updatedAt)}
                      </div>
                    </div>
                </div>

                <div 
                  className="delete-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
                        onDeleteConversation(conversation._id);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    color: '#ef4444',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    marginLeft: '4px'
                  }}
                  title="Xóa cuộc trò chuyện"
                >
                  <Trash2 size={16} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
