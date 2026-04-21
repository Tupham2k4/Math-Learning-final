import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import "./Navbar.css";
import letterm from "../Assets/letter-m.png";
import home from "../Assets/home.png";
import book from "../Assets/book.png";
import book1 from "../Assets/book1.png";
import video from "../Assets/video.png";
import document1 from "../Assets/document1.png";
import robot from "../Assets/robot.png";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={letterm} alt="Math Learning Logo" />
          <span>Math Learning</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={home} alt="Trang chủ" className="nav-icon" />
            <span>Trang chủ</span>
          </Link>
          <Link
            to="/bai-giang"
            className={`navbar-link ${isActive("/bai-giang") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={book1} alt="Bài giảng" className="nav-icon" />
            <span>Bài giảng</span>
          </Link>
          <Link
            to="/bai-tap"
            className={`navbar-link ${isActive("/bai-tap") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={book} alt="Bài tập" className="nav-icon" />
            <span>Bài tập</span>
          </Link>
          <Link
            to="/video-bai-giang"
            className={`navbar-link ${
              isActive("/video-bai-giang") ? "active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={video} alt="Video bài giảng" className="nav-icon" />
            <span>Video bài giảng</span>
          </Link>
          <Link
            to="/kho-de"
            className={`navbar-link ${isActive("/kho-de") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={document1} alt="Kho đề" className="nav-icon" />
            <span>Kho đề</span>
          </Link>
          <Link
            to="/chatbot"
            className={`navbar-link ${isActive("/chatbot") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <img src={robot} alt="Chatbot AI" className="nav-icon" />
            <span>ChatbotAI</span>
          </Link>
        </div>

        {user ? (
          <div className="navbar-user-section">
            <div className="user-avatar-circle" onClick={() => setShowProfile(!showProfile)}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            {showProfile && (
              <div className="user-info-card">
                <div className="user-info-avatar">
                   {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="user-info-name">{user.name}</h3>
                <p className="user-info-email">{user.email}</p>
                <button className="logout-btn" onClick={() => {
                   setShowProfile(false);
                   logout();
                }}>Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/dang-nhap" className="navbar-login-btn">
            Đăng nhập
          </Link>
        )}

        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
