import axios from 'axios';

const API_URL = 'http://localhost:4000/api/admin/chat';
//Tạo axios instance để dễ dàng quản lý cấu hình chung
const adminChatApi = axios.create({
    baseURL: API_URL,
});
//Thêm interceptor để tự động chèn JWT token vào header của mỗi request
adminChatApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Lấy toàn bộ log chat cho admin
export const getAllChatLogs = async () => {
    try {
        const response = await adminChatApi.get('/logs');
        return response.data;
    } catch (error) {
        console.error('Error fetching all chat logs:', error);
        throw error.response?.data || error.message;
    }
};

//Lấy danh sách chat log theo conversationId
export const getConversationLogs = async (conversationId) => {
    try {
        const response = await adminChatApi.get(`/logs/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching logs for conversation ${conversationId}:`, error);
        throw error.response?.data || error.message;
    }
};

//Xóa bản ghi log chat
export const deleteChatLog = async (id) => {
    try {
        const deleteResponse = await adminChatApi.delete(`/logs/${id}`);
        return deleteResponse.data;
    } catch (error) {
        console.error(`Error deleting chat log ${id}:`, error);
        throw error.response?.data || error.message;
    }
};

//Lấy danh sách tin nhắn theo conversationId
export const getMessagesByConversation = async (conversationId) => {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`http://localhost:4000/api/messages/${conversationId}`, {
            headers: { 'auth-token': token }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for conversation ${conversationId}:`, error);
        throw error.response?.data || error.message;
    }
};

//Lấy dữ liệu thống kê chatbot
export const getChatbotStats = async () => {
    try {
        const response = await adminChatApi.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching chatbot stats:', error);
        throw error.response?.data || error.message;
    }
};
