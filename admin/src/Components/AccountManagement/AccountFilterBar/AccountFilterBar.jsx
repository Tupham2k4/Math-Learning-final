import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import './AccountFilterBar.css';

const AccountFilterBar = ({
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    onAddUser
}) => {
    return (
        <div className="account-filter-bar">
            {/* Vùng tìm kiếm và lọc */}
            <div className="account-filter-left">
                <div className="account-search-wrapper">
                    <Search size={18} className="account-search-icon" />
                    <input
                        type="text"
                        className="account-search-input"
                        placeholder="Tìm kiếm tên tài khoản hoặc email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="account-role-wrapper">
                    <Filter size={18} className="account-role-icon" />
                    <select
                        className="account-role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Tất cả tài khoản</option>
                        <option value="user">Học sinh</option>
                        <option value="admin">Quản trị viên</option>
                    </select>
                </div>
            </div>

            {/* Vùng thêm mới */}
            <div className="account-filter-right">
                <button className="account-add-btn" onClick={onAddUser}>
                    <Plus size={18} />
                    <span>Thêm tài khoản</span>
                </button>
            </div>
        </div>
    );
};

export default AccountFilterBar;
