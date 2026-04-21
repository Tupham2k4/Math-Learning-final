import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import "./DangKy.css";
import logo from "../Components/Assets/logo.png";
import book from "../Components/Assets/book.png";
import check from "../Components/Assets/check.png";
import robot from "../Components/Assets/robot.png";
import view from "../Components/Assets/view.png";

const DangKy = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) {
      return setErrorMsg("Vui lòng nhập đầy đủ thông tin");
    }
    if (password.length < 6) {
      return setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (password !== confirmPassword) {
      return setErrorMsg("Mật khẩu xác nhận không khớp");
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/dang-ky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();

      if (data.success) {
        login(data.token);
        navigate("/");
      } else {
        setErrorMsg(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối đến Server");
    }
  };

  return (
    <div className="dang-ky">
      <div className="left-column">
        <div className="logo">
          <img src={logo} alt="Math Learning Logo"></img>
          <h1>Math Learning</h1>
        </div>

        <div className="register-left">
          <h1>Bắt đầu hành trình học toán cực kỳ thú vị cùng với chúng tôi</h1>
          <p>
            Tham gia cộng đồng học sinh yêu thích toán học, nơi bạn có thể luyện
            tập, thi đấu và phát triển kỹ năng
          </p>

          <div className="features-list">
            <div className="feature-item">
              <img src={book} alt="" />
              <p>Bài tập, kho đề đa dạng, bao gồm cả trắc nghiệm và tự luận</p>
            </div>

            <div className="feature-item">
              <img src={check} alt="" />
              <p>
                Kho đề sát với kiến thức đã học, giải thích đáp án rõ ràng, dễ
                hiểu
              </p>
            </div>

            <div className="feature-item">
              <img src={robot} alt="" />
              <p>
                Chatbot AI hỗ trợ học tập 24/7, giúp học sinh giải đáp mọi thắc
                mắc về bài tập
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="register-right">
        <h1>Đăng ký</h1>
        <p className="register-subtitle">Tạo tài khoản mới</p>

        {errorMsg && (
          <div className="error-message" style={{ color: "red", fontSize: "14px", marginBottom: "15px" }}>
            {errorMsg}
          </div>
        )}

        <div className="input-group">
          <label>Họ và tên</label>
          <input 
            type="text" 
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input 
            type="text" 
            placeholder="Nhập email"
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

        <div className="input-group">
          <label>Xác nhận mật khẩu</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              src={view}
              alt="Xác nhận mật khẩu"
              className="view-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>

        <button className="register-btn" onClick={handleRegister}>Đăng ký</button>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <p className="login-text">
          Bạn đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="login-link">
            Đăng nhập ngay!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DangKy;
