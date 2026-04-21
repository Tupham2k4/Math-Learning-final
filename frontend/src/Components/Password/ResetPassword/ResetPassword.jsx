import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../../services/authService';
import './ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        if (password.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setLoading(false);
            return;
        }

        try {
            await resetPassword(token, password);
            setMessage("Mật khẩu đã được cập nhật thành công! Đang chuyển hướng...");
            
            // Redirect sau 2 giây để user kịp đọc thông báo
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra hoặc link đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Đặt lại Mật Khẩu</h2>
                <p className="subtitle">
                    Vui lòng nhập mật khẩu mới của bạn bên dưới.
                </p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading || !password || !confirmPassword}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
