import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message };
    }
};

export const resetPassword = async (token, password) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message };
    }
};
