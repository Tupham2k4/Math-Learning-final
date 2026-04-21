import axios from "axios";

const API_URL = "http://localhost:4000/api/results";

export const getStudyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error("Loi khi lay thong ke bai lam:", error);
    throw error.response?.data || error;
  }
};

export const getAllSubmissions = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Loi khi lay danh sach bai lam:", error);
    throw error.response?.data || error;
  }
};

export const getSubmissionDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Loi khi lay chi tiet bai lam (id: ${id}):`, error);
    throw error.response?.data || error;
  }
};

export const gradeSubmission = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/grade/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Loi khi cham diem (id: ${id}):`, error);
    throw error.response?.data || error;
  }
};

export const deleteSubmission = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Loi khi xoa bai lam (id: ${id}):`, error);
    throw error.response?.data || error;
  }
};
