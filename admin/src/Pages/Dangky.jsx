import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, User, BookOpen, CheckCircle, BarChart } from 'lucide-react';
import letterm from '../assets/letter-m.png';
import './Dangnhap.css';

const Dangky = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Mật khẩu và xác nhận mật khẩu không khớp');
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:4000/api/auth/dang-ky', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'admin' 
            });

            if (response.data.success) {
                alert('Đăng ký tài khoản Admin thành công!');
                navigate('/dang-nhap-admin');
            }
        } catch (err) {
            console.error('Registration Error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            {/* ---------------- Cột Trái ---------------- */}
            <div className="login-left">
                <div className="login-left-content">
                    
                    {/* Logo & Intro ngang */}
                    <div className="login-logo-section">
                        <img src={letterm} alt="Logo" className="login-logo-img" />
                        <div className="login-logo-text">
                            <h2>Math Learning Admin</h2>
                            <p>Admin Portal</p>
                        </div>
                    </div>

                    {/* Intro chính */}
                    <div className="login-intro">
                        <h1>Sẵn sàng để bắt đầu<br/>quản trị hệ thống?</h1>
                        <p>Đăng ký tài khoản Admin để kiểm soát nội dung và người dùng</p>
                    </div>

                    {/* Feature Cards (3 thẻ chức năng) */}
                    <div className="login-features">
                        <div className="feature-card">
                            <div className="feature-icon"><BookOpen size={24} /></div>
                            <div className="feature-info">
                                <h3>Quản lý bài tập</h3>
                                <p>Thêm, sửa, xóa bài tập dễ dàng</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><CheckCircle size={24} /></div>
                            <div className="feature-info">
                                <h3>Chấm điểm tự động</h3>
                                <p>Hệ thống chấm điểm thông minh</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><BarChart size={24} /></div>
                            <div className="feature-info">
                                <h3>Thống kê chi tiết</h3>
                                <p>Báo cáo và phân tích toàn diện</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Cột Phải ---------------- */}
            <div className="login-right">
                <div className="login-form-card">
                    <div className="login-form-header">
                        <h2>Đăng ký tài khoản</h2>
                        <p>Vui lòng điền thông tin để tạo tài khoản quản trị</p>
                    </div>

                    {error && <div className="login-error-msg" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                    <form className="login-form" onSubmit={handleRegister}>
                        
                        {/* Input Họ và Tên */}
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <div className="input-with-icon">
                                <User size={20} className="input-icon" />
                                <input 
                                    name="name"
                                    type="text" 
                                    placeholder="Nhập họ và tên của bạn" 
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Tên Đăng Nhập / Email */}
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-with-icon">
                                <Mail size={20} className="input-icon" />
                                <input 
                                    name="email"
                                    type="email" 
                                    placeholder="Nhập email của bạn" 
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="input-with-icon">
                                <Lock size={20} className="input-icon" />
                                <input 
                                    name="password"
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Nhập mật khẩu" 
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <div className="input-with-icon">
                                <Lock size={20} className="input-icon" />
                                <input 
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Nhập lại mật khẩu" 
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Nút Đăng ký */}
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
                        </button>

                        {/* Divider */}
                        <div className="login-divider">
                            <span>hoặc</span>
                        </div>

                        {/* Đã có tài khoản */}
                        <div className="login-footer">
                            <span>Bạn đã có tài khoản?</span>
                            <Link to="/dang-nhap-admin" className="register-link">Đăng nhập ngay</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dangky;
