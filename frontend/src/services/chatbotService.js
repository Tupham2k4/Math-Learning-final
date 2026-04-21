import axios from "axios";

const API_URL = "http://localhost:4000/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'auth-token': token || ''
        }
    };
};

export const createConversation = async () => {
    const response = await axios.post(`${API_URL}/conversations`, {}, getAuthHeaders());
    return response.data;
};

export const getConversations = async () => {
    const response = await axios.get(`${API_URL}/conversations`, getAuthHeaders());
    return response.data;
};

export const getConversationById = async (id) => {
    const response = await axios.get(`${API_URL}/conversations/${id}`, getAuthHeaders());
    return response.data;
};

export const getMessages = async (conversationId) => {
    const response = await axios.get(`${API_URL}/messages/${conversationId}`, getAuthHeaders());
    return response.data;
};

export const sendMessage = async (data) => {
    const response = await axios.post(`${API_URL}/chatbot/send`, data, getAuthHeaders());
    return response.data;
}; 

export const deleteConversation = async (id) => {
    const response = await axios.delete(`${API_URL}/conversations/${id}`, getAuthHeaders());
    return response.data;
};

export const getSuggestions = async () => {
    const response = await axios.get(`${API_URL}/chatbot/suggestions`, getAuthHeaders());
    return response.data;
};