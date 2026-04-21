import React from 'react';
import AdminChatLogs from '../Components/ChatbotManagement/AdminChatLogs/AdminChatLogs';
import ChatbotStatsCards from '../Components/ChatbotManagement/ChatbotStatsCards/ChatbotStatsCards';

const ChatbotManagement = () => {
    return (
        <div className="chatbot-management-page">
            <ChatbotStatsCards />
            <AdminChatLogs />
        </div>
    );
};

export default ChatbotManagement;
