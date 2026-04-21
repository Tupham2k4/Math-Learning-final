import axios from "axios";

const API_URL = "http://localhost:4000/api/questions";

export const getExerciseStats = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch user stats:", error);
        throw error.response?.data || error;
    }
};

export const createExercise = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm bài tập:", error);
        throw error.response?.data || error;
    }
};

export const deleteExercise = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa bài tập:", error);
        throw error.response?.data || error;
    }
};

export const updateExercise = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật bài tập:", error);
        throw error.response?.data || error;
    }
};