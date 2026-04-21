import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Logic để tạo mảng hiển thị số trang với dấu "..."
    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1, 
                '...', 
                totalPages - 4, 
                totalPages - 3, 
                totalPages - 2, 
                totalPages - 1, 
                totalPages
            ];
        }

        return [
            1, 
            '...', 
            currentPage - 1, 
            currentPage, 
            currentPage + 1, 
            '...', 
            totalPages
        ];
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination-container">
            <button 
                className="pagination-btn pagination-nav-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={18} />
                <span className="pagination-nav-text">Trang trước</span>
            </button>

            <div className="pagination-numbers">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="pagination-dots">
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            className={`pagination-btn pagination-number-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button 
                className="pagination-btn pagination-nav-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <span className="pagination-nav-text">Trang tiếp</span>
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
