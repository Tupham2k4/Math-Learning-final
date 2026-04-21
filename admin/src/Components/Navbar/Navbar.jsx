import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import letterm from '../../assets/letter-m.png';
import "./Navbar.css";

const Navbar = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu admin đã đăng nhập
    const token = localStorage.getItem('adminToken');
    const data = localStorage.getItem('adminData');
    if (token && data) {
      setAdmin(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    navigate('/dang-nhap-admin');
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={letterm} alt="Logo" />
          <span>Math Learning Admin</span>
        </Link>
        
        {admin ? (
          <div className="navbar-user-profile">
            <div className="navbar-avatar">
              {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="navbar-user-info-box">
              <span className="navbar-user-name">{admin.name}</span>
              <span className="navbar-user-email">{admin.email}</span>
            </div>
            <button className="navbar-logout-btn" onClick={handleLogout} title="Đăng xuất">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/dang-nhap-admin" className="navbar-login">
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar;
