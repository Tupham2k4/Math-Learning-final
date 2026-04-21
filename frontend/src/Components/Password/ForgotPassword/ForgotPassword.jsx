import React, { useState } from 'react';
import { forgotPassword } from '../../../services/authService';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await forgotPassword(email);
            setMessage("Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu");
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Quên Mật Khẩu</h2>
                <p className="subtitle">
                    Nhập email bạn đã dùng để đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
                </p>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">Email của bạn</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Nhập email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading || !email}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                </form>
                
                <div className="back-to-login">
                    <a href="/login">&larr; Quay lại trang đăng nhập</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
