import axios from 'axios';

const API_URL = 'http://localhost:4000/api/comments';

/**
 * Lấy danh sách bình luận của video
 * @param {string} videoId 
 * @returns {Promise<Array>}
 */
export const getComments = async (videoId) => {
    try {
        const response = await axios.get(`${API_URL}/${videoId}`);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Lỗi khi tải bình luận');
    } catch (error) {
        console.error('Error fetching comments:', error);
        if (error.response) {
            console.error('SERVER RESPONSE ERROR DATA:', error.response.data);
            if (error.response.data && error.response.data.error) {
                throw new Error(`Server: ${error.response.data.error}`);
            } else if (error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
        }
        throw new Error(error.message || "Lỗi mạng hoặc server không phản hồi");
    }
};

/**
 * Thêm một bình luận mới
 * @param {Object} commentData - { content, videoId, parentComment }
 * @param {string} token - JWT token
 * @returns {Promise<Object>}
 */
export const createComment = async (commentData, token) => {
    try {
        const response = await axios.post(API_URL, commentData, {
            headers: {
                'auth-token': token,
            },
        });
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Lỗi khi tạo bình luận');
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

/**
 * Xóa một bình luận
 * @param {string} commentId 
 * @param {string} token 
 * @returns {Promise<boolean>}
 */
export const deleteComment = async (commentId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/${commentId}`, {
            headers: {
                'auth-token': token,
            },
        });
        return response.data.success;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};
