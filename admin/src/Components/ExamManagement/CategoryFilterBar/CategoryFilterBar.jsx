import React from 'react';
import { Filter } from 'lucide-react';
import './CategoryFilterBar.css';

const CategoryFilterBar = ({
    selectedRole,
    setSelectedRole,
}) => {
    return (
        <div className="category-filter-bar">
            {/* Vùng tìm kiếm và lọc */}
            <div className="category-filter-left">
                <div className="category-role-wrapper">
                    <Filter size={18} className="category-role-icon" />
                    <select
                        className="category-role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="">Tất cả Loại</option>
                        <option value="vao10">Đề thi vào 10 cấp tỉnh</option>
                        <option value="thpt">Đề thi THPT Quốc gia</option>
                        <option value="thi_thu">Đề thi thử THPT Quốc gia của các tỉnh và các trường</option>
                        <option value="hsg">Đề thi chọn HSG cấp tỉnh các tỉnh</option>
                        <option value="khac">Khác</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilterBar;
