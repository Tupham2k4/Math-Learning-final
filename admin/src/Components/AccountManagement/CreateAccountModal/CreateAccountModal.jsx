import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import './CreateAccountModal.css';

const CreateAccountModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;
    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý validate form
    const validateForm = () => {
        if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password) {
            setError("Vui lòng nhập đầy đủ các trường bắt buộc.");
            return false;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //kiểm tra định dạng email
        if (!emailRegex.test(formData.email)) {
            setError("Định dạng email không hợp lệ.");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
            setFormData({
                name: '',
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
        } catch (err) {
            console.error("Lỗi từ onSubmit:", err);
            setError(err.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-modal-backdrop">
            <div className="create-account-modal">
                <div className="account-modal-header">
                    <div className="account-modal-title-group">
                        <div className="account-modal-icon">
                            <UserPlus size={20} />
                        </div>
                        <h2>Thêm tài khoản mới</h2>
                    </div>
                    <button className="account-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="account-modal-content">
                    {error && <div className="account-modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="create-account-form">
                        
                        <div className="account-form-group">
                            <label>Họ và tên <span className="account-required">*</span></label>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Nhập họ và tên..." 
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="account-form-row">
                            <div className="account-form-group half-col">
                                <label>Tên đăng nhập <span className="account-required">*</span></label>
                                <input 
                                    type="text" 
                                    name="username"
                                    placeholder="Ví dụ: user123" 
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="account-form-group half-col">
                                <label>Email <span className="account-required">*</span></label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="example@gmail.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="account-form-row">
                            <div className="account-form-group half-col">
                                <label>Mật khẩu <span className="account-required">*</span></label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Tối thiểu 6 ký tự" 
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="account-form-group half-col">
                                <label>Vai trò <span className="account-required">*</span></label>
                                <select 
                                    name="role"
                                    value={formData.role} 
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="user">Học sinh</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                        </div>

                        <div className="account-modal-actions">
                            <button 
                                type="button" 
                                className="account-cancel-btn" 
                                onClick={onClose}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button 
                                type="submit" 
                                className="account-submit-btn" 
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Thêm tài khoản'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountModal;
