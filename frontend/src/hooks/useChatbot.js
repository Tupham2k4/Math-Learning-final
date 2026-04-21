import { useState, useEffect } from 'react';
import * as chatbotService from '../services/chatbotService';

const useChatbot = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    const fetchConversations = async () => {
        try {
            const data = await chatbotService.getConversations();
            // Xử lý data trả về
            setConversations(data.conversations || data.data || (Array.isArray(data) ? data : []));
        } catch (err) {
            console.error("Lỗi khi tải danh sách hội thoại:", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const data = await chatbotService.getSuggestions();
            setSuggestions(data.suggestions || data.data || (Array.isArray(data) ? data : []));
        } catch (err) {
            console.error("Lỗi khi tải câu hỏi gợi ý:", err);
        }
    };

    useEffect(() => {
        fetchConversations();
        fetchSuggestions();
    }, []);

    const fetchMessages = async (conversationId) => {
        try {
            setSelectedConversation(conversationId);
            setLoading(true);
            const data = await chatbotService.getMessages(conversationId);
            setMessages(data.messages || data.data || (Array.isArray(data) ? data : []));
        } catch (err) {
            console.error("Lỗi khi tải tin nhắn:", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewConversation = async () => {
        try {
            setLoading(true);
            const data = await chatbotService.createConversation();
            const newConv = data.conversation || data.data || data;
            setSelectedConversation(newConv._id); 
            setMessages([]);
            await fetchConversations();
            return newConv;
        } catch (err) {
            console.error("Lỗi khi tạo hội thoại:", err);
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (messageContent) => {
        if (!messageContent || messageContent.trim() === '') return;

        try {
            setError(null);
            let currentConversationId = selectedConversation;

            if (!currentConversationId) {
                const newConv = await createNewConversation();
                currentConversationId = newConv._id;
            }

            // Thêm message user tạm thời
            const tempUserMessage = {
                _id: Date.now().toString(),
                sender: 'user',
                content: messageContent,
                createdAt: new Date().toISOString()
            };
            setMessages(prev => [...prev, tempUserMessage]);
            setLoading(true);

            // Gọi API
            const response = await chatbotService.sendMessage({
                conversationId: currentConversationId,
                message: messageContent
            });

            // Lấy bot message từ response và cập nhật (tùy vào logic response trả về botMessage hay toàn bộ messages mới)
            const responseData = response.data || response;
            if (responseData.botMessage) {
                 setMessages(prev => [...prev, responseData.botMessage]);
            } else if (responseData.newMessage) {
                 setMessages(prev => [...prev, responseData.newMessage]);
            } else {
                 // Nếu không xác định, fetch lại toàn bộ bộ tin nhắn
                 await fetchMessages(currentConversationId);
            }

            // Fetch lại conversations để cập nhật tin nhắn cuối cùng trên sidebar
            await fetchConversations();

        } catch (err) {
            console.error("Lỗi khi gửi tin nhắn:", err);
            const serverError = err.response?.data?.error ? ` (Chi tiết: ${err.response.data.error})` : "";
            setError((err.response?.data?.message || "Lỗi khi gửi tin nhắn") + serverError);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConversation = async (id) => {
        try {
            await chatbotService.deleteConversation(id);
            if (id === selectedConversation) {
                setSelectedConversation(null);
                setMessages([]);
            }
            await fetchConversations();
        } catch (err) {
            console.error("Lỗi khi xoá hội thoại:", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    return {
        conversations,
        selectedConversation,
        messages,
        loading,
        suggestions,
        error,
        fetchConversations,
        fetchMessages,
        createNewConversation,
        handleSendMessage,
        handleDeleteConversation,
        fetchSuggestions,
        setSelectedConversation, 
        setMessages 
    };
};

export default useChatbot;
