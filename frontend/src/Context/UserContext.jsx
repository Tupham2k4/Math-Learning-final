import React, { createContext, useState, useEffect } from 'react';

// Tạo Context
export const UserContext = createContext();

// Provider cho Context
export const UserProvider = ({ children }) => {
    // State quản lý thông tin user và trạng thái loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm gọi API /api/auth/me để lấy thông tin user từ token
    const fetchUser = async (token) => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token // Gửi token lên server qua header
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setUser(data.data);
            } else {
                // Token không hợp lệ hoặc hết hạn -> Xóa token và user
                setUser(null);
                localStorage.removeItem('auth-token');
            }
        } catch (error) {
            console.error('Lỗi khi fetch thông tin user:', error);
            setUser(null);
            localStorage.removeItem('auth-token');
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý login, nhận token từ API trả về để lưu trữ và fetch user
    const login = (token) => {
        localStorage.setItem('auth-token', token);
        fetchUser(token);
    };

    // Hàm đăng xuất, xóa token và đưa auth về null
    const logout = () => {
        localStorage.removeItem('auth-token');
        setUser(null);
        // Có thể dùng window.location.href để về trang đăng nhập
        window.location.href = '/dang-nhap'; 
    };

    // Lifecycle - Khi load ứng dụng sẽ tự động check token
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    // Expose value
    return (
        <UserContext.Provider value={{ user, loading, login, logout, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};
