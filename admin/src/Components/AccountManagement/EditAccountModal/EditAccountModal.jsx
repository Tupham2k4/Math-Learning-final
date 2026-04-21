import React, { useState, useEffect } from 'react';
import { X, UserCheck } from 'lucide-react';
import './EditAccountModal.css';

const EditAccountModal = ({ isOpen, onClose, selectedUser, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '', 
        role: 'user'
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedUser) {
            setFormData({
                name: selectedUser.name || '',
                username: selectedUser.username || (selectedUser.email ? selectedUser.email.split('@')[0] : ''),
                email: selectedUser.email || '',
                password: '',
                role: selectedUser.role || 'user'
            });
            setError('');
        }
    }, [isOpen, selectedUser]);

    if (!isOpen || !selectedUser) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
            setError("Họ tên, Tên đăng nhập và Email không được để trống.");
            return false;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Định dạng email không hợp lệ.");
            return false;
        }

        // Mật khẩu không bắt buộc, nhưng nếu nhập thì phải >= 6
        if (formData.password && formData.password.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
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
            // Loại bỏ password khỏi payload nếu ng dùng không muốn đổi
            const payload = { ...formData };
            if (!payload.password) {
                delete payload.password;
            }

            await onSubmit(selectedUser._id, payload);
            
            // Parent handles closing
        } catch (err) {
            console.error("Lỗi từ onSubmit sửa tài khoản:", err);
            setError(err.message || "Đã có lỗi xảy ra. Hãy kiểm tra kết nối!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-modal-backdrop">
            <div className="edit-account-modal">
                <div className="account-modal-header">
                    <div className="account-modal-title-group">
                        <div className="account-modal-edit-icon">
                            <UserCheck size={20} />
                        </div>
                        <h2>Chỉnh sửa tài khoản</h2>
                    </div>
                    <button className="account-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="account-modal-content">
                    {error && <div className="account-modal-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="edit-account-form">
                        
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
                                <label>Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Bỏ trống nếu giữ nguyên" 
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
                                className="account-submit-edit-btn" 
                                disabled={loading}
                            >
                                {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditAccountModal;
