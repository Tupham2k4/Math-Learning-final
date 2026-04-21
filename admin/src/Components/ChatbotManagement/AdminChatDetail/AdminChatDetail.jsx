import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessagesByConversation } from '../ChatbotService/adminChatService';
import MathRenderer from '../MathRenderer/MathRenderer';
import './AdminChatDetail.css';
import { ArrowLeft, User, Bot, Loader2, AlertCircle } from 'lucide-react';

const AdminChatDetail = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const data = await getMessagesByConversation(conversationId);
                if (data.success) {
                    setMessages(data.messages);
                } else {
                    setError('Không thể tải tin nhắn.');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };

        if (conversationId) {
            fetchMessages();
        }
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTimestamp = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="admin-chat-detail-loading">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p>Đang tải hội thoại...</p>
        </div>
    );

    if (error) return (
        <div className="admin-chat-detail-error">
            <AlertCircle size={40} color="#ff4d4f" />
            <p>{error}</p>
            <button className="btn-back" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );

    return (
        <div className="admin-chat-detail-container">
            <div className="chat-detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                </button>
                <div className="conversation-info">
                    <h2>Chi tiết hội thoại</h2>
                    <span className="id-badge">ID: {conversationId}</span>
                </div>
            </div>

            <div className="chat-window card-shadow">
                <div className="messages-list">
                    {messages.length === 0 ? (
                        <div className="empty-chat">Không có tin nhắn nào trong hội thoại này.</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={msg._id || index} className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                                <div className="avatar">
                                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className="message-content-container">
                                    <div className="message-bubble">
                                        {msg.sender === 'bot' ? (
                                            <MathRenderer content={msg.content} />
                                        ) : (
                                            <span>{msg.content}</span>
                                        )}
                                    </div>
                                    <span className="timestamp">{formatTimestamp(msg.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default AdminChatDetail;
