import React from 'react';
import { Users } from 'lucide-react';
import './EmptyState.css';

const EmptyState = () => {
    return (
        <div className="account-empty-state">
            <div className="empty-icon-wrapper">
                <Users size={48} />
            </div>
            <h3>Không tìm thấy tài khoản nào</h3>
            <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
        </div>
    );
};

export default EmptyState;
