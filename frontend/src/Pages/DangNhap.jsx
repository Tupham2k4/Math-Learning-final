import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "./DangNhap.css";
import logo from "../Components/Assets/logo.png";
import toanhoc from "../Components/Assets/toan-hoc.png";
import view from "../Components/Assets/view.png";

const DangNhap = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      return setErrorMsg("Vui lòng nhập đầy đủ thông tin");
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/dang-nhap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        // Lưu token và fetch user thông qua logic bên model đã cung cấp
        login(data.token);
        // Redirect về màn chính
        navigate("/");
      } else {
        setErrorMsg(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối đến Server");
    }
  };

  return (
    <div className="dang-nhap">
      <div className="logo">
        <img src={logo} alt="Math Learning Logo"></img>
        <h1>Math Learning</h1>
      </div>
      <div className="login-left">
        <img src={toanhoc} alt="Math illustration"></img>
        <h1>Học toán thông minh</h1>
        <p>Dành cho học sinh lớp 1 đến lớp 12</p>
      </div>
      <div className="login-right">
        <h1>Đăng nhập</h1>
        <p className="welcome-text">Chào mừng trở lại</p>

        {errorMsg && (
          <div className="error-message" style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>
            {errorMsg}
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input 
            type="text" 
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Nhập mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <img 
              src={view} 
              alt="Xem mật khẩu" 
              className="view-icon" 
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <p className="forgot-password">
          <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>Quên mật khẩu?</Link>
        </p>

        <button className="login-btn" onClick={handleLogin}>Đăng nhập</button>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <p className="register-text">
          Bạn chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="register-link">
            Đăng ký ngay!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DangNhap;
