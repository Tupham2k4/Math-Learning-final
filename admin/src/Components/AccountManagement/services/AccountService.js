import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';
const AUTH_URL = 'http://localhost:4000/api/auth';

// Lấy danh sách tài khoản kèm theo phân trang và tìm kiếm
export const getUsers = async (search = '', role = '', page = 1, limit = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                search,
                role,
                page,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch users:", error);
        throw error.response?.data || error;
    }
};

// Lấy thống kê số lượng tài khoản
export const getUserStats = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch user stats:", error);
        throw error.response?.data || error;
    }
};

// Tạo tài khoản mới thông qua route auth
export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${AUTH_URL}/dang-ky`, userData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo user:", error);
        throw error.response?.data || error;
    }
};

// Cập nhật thông tin tài khoản (và đổi mật khẩu nếu có nhập)
export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật user:", error);
        throw error.response?.data || error;
    }
};

// Xóa vĩnh viễn tài khoản
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi xóa user:", error);
        throw error.response?.data || error;
    }
};
