import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, BookOpen, CheckCircle, BarChart } from 'lucide-react';
import letterm from '../assets/letter-m.png';
import './Dangnhap.css';

const Dangnhap = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/dang-nhap', formData);
      
      if (response.data.success) {
        if (response.data.role === 'admin') {
          // Lưu token vào localStorage
          localStorage.setItem('adminToken', response.data.token);
          // Lưu thông tin admin
          localStorage.setItem('adminData', JSON.stringify({
             name: response.data.user.name,
             email: response.data.user.email,
             role: response.data.role
          }));
          alert('Đăng nhập thành công!');
          navigate('/'); // Về trang dashboard
        } else {
          setError('Trang này chỉ dành cho tài khoản Admin!');
        }
      }
    } catch (err) {
       console.error("Login Error:", err);
       setError(err.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập');
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
            <h1>Hệ thống quản lý<br/>học tập toán học</h1>
            <p>Nền tảng quản trị cho giảng viên / admin</p>
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
            <h2>Đăng nhập quản trị</h2>
            <p>Chào mừng trở lại. Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {error && <div className="login-error-msg" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            
            {/* Input Email */}
            <div className="form-group">
               <label>Email</label>
               <div className="input-with-icon">
                 <Mail size={20} className="input-icon" />
                 <input 
                   type="email" 
                   placeholder="Nhập email của bạn" 
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   required 
                 />
               </div>
            </div>

            {/* Input Password */}
            <div className="form-group">
               <label>Mật khẩu</label>
               <div className="input-with-icon">
                 <Lock size={20} className="input-icon" />
                 <input 
                   type={showPassword ? "text" : "password"} 
                   placeholder="Nhập mật khẩu" 
                   value={formData.password}
                   onChange={(e) => setFormData({...formData, password: e.target.value})}
                   required
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

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
               <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
               </label>
               <Link to="/quen-mat-khau" className="forgot-password-link">Quên mật khẩu?</Link>
            </div>

            {/* Nút Đăng nhập */}
            <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>

            {/* Divider (hoặc) */}
            <div className="login-divider">
               <span>hoặc</span>
            </div>

            {/* Chưa có tài khoản */}
            <div className="login-footer">
               <span>Bạn chưa có tài khoản?</span>
               <Link to="/dang-ky-admin" className="register-link">Đăng ký ngay</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Dangnhap;
