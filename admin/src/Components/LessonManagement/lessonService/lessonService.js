import axios from 'axios';

const API_URL = 'http://localhost:4000/api/lessons';
const UPLOAD_URL = 'http://localhost:4000/api/upload/image';

// Thêm token vào Header
const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo.token || localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
    };
};

export const getLessons = async (search = '', grade = '', page = 1, limit = 10) => {
    try {
        const params = { search, grade, page, limit };
        const response = await axios.get(API_URL, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

//Lấy chi tiết bài giảng
export const getLessonById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

//Upload ảnh đại diện
const uploadThumbnail = async (thumbnailFile) => {
    const uploadData = new FormData();
    uploadData.append('image', thumbnailFile);
    
    const res = await axios.post(UPLOAD_URL, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.data && res.data.success) {
        return res.data.image_url;
    }
    throw new Error('Lỗi upload ảnh đại diện');
};

//Tạo mới Lesson
export const createLesson = async (formData) => {
    try {
        let thumbnailUrl = '';
        
        // 1. Nếu có file ảnh thumbnail thì đẩy lên Cloudinary trước
        if (formData.thumbnailFile) {
            thumbnailUrl = await uploadThumbnail(formData.thumbnailFile);
        }

        // 2. Chuyển đổi payload theo Schema Database
        const payload = {
            title: formData.title,
            chapterId: formData.chapterId,
            thumbnail: thumbnailUrl,
            order: formData.order || 1, 
            content: {
                mucTieu: formData.content?.mucTieu || '',
                ghiNho: formData.content?.ghiNho || '',
                khaiNiem: formData.content?.khaiNiem || '',
                viDu: formData.content?.viDu || ''
            }
        };

        const response = await axios.post(API_URL, payload, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

//Cập nhật Lesson
export const updateLesson = async (id, formData) => {
    try {
        let thumbnailUrl = formData.thumbnail || '';
        
        // Xử lý Xóa ảnh cũ theo cờ từ EditModal
        if (formData.removeThumbnail) {
            thumbnailUrl = '';
        }

        // 1. Nếu có upload file mới
        if (formData.thumbnailFile) {
            thumbnailUrl = await uploadThumbnail(formData.thumbnailFile);
        }

        // 2. Dựng data cập nhật
        const payload = {
            title: formData.title,
            chapterId: formData.chapterId,
            thumbnail: thumbnailUrl,
            content: {
                mucTieu: formData.content?.mucTieu || '',
                ghiNho: formData.content?.ghiNho || '',
                khaiNiem: formData.content?.khaiNiem || '',
                viDu: formData.content?.viDu || '',
            }
        };

        const response = await axios.put(`${API_URL}/${id}`, payload, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

//Xóa Lesson
export const deleteLesson = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
