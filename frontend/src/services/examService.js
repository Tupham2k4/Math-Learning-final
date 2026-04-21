import axios from 'axios';

const API_URL = 'http://localhost:4000/api/exams';

export const getExamsByChapter = async (chapterId) => {
    try {
        const response = await axios.get(`${API_URL}/chapter/${chapterId}`);
        
        if (response.data.success) {
            return response.data.data; 
        }
        
        throw new Error(response.data.message || 'Lỗi khi lấy danh sách đề thi từ Server');
    } catch (error) {
        console.error('Lỗi khi fetch exams từ chapterId:', error);
        
        if (error.response && error.response.data) {
            const serverMessage = error.response.data.message || error.response.data.error;
            throw new Error(serverMessage || 'Lỗi từ phía máy chủ');
        }
        
        throw new Error(error.message || 'Lỗi kết nối mạng hoặc máy chủ không phản hồi');
    }
};

