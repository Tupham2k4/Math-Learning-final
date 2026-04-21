import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import './ChapterTable.css';

const ChapterTable = ({ selectedGrade, searchTerm, refreshKey, onEditChapter, onDeleteChapter }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchChapters();
  }, [refreshKey]);
  // Hàm fetchChapters xử lý việc lấy dữ liệu từ API
  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/chapters');
      const data = response.data.data || response.data || [];
      // Sắp xếp theo lớp (grade) và tiêu đề nếu cần
      setChapters(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách chương:", error);
    } finally {
      setLoading(false);
    }
  };
  // Hàm filteredChapters xử lý việc lọc dữ liệu
  const filteredChapters = chapters.filter(chapter => {
    const matchGrade = selectedGrade 
        ? (chapter.grade === selectedGrade || `Lớp ${chapter.grade}` === selectedGrade || chapter.grade?.toString().includes(selectedGrade.replace('Lớp ', '')))
        : true;
        
    const matchSearch = searchTerm 
        ? chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

    return matchGrade && matchSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, searchTerm]);
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChapters = filteredChapters.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (chapter) => {
    if(onEditChapter) {
        onEditChapter(chapter);
    }
  };

  const handleDelete = (chapter) => {
    if(onDeleteChapter) {
        onDeleteChapter(chapter);
    }
  };

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="chapter-table-wrapper">
      <div className="chapter-table-container">
        {loading ? (
          <div className="chapter-table-loading">Đang tải dữ liệu...</div>
        ) : (
          <div className="table-responsive">
            <table className="chapter-table">
              <thead>
                <tr>
                  <th width="8%">STT</th>
                  <th width="60%">Tên chương</th>
                  <th width="15%">Khối lớp</th>
                  <th width="17%" className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentChapters.length > 0 ? (
                  currentChapters.map((chapter, index) => (
                    <tr key={chapter._id || index}>
                      <td>{startIndex + index + 1}</td>
                      <td className="chapter-title-cell">{chapter.title}</td>
                      <td>
                        <span className="grade-badge">
                          {chapter.grade?.toString().includes('Khối') ? chapter.grade : `Lớp ${chapter.grade || 'N/A'}`}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="action-buttons">
                          <button 
                            className="btn-edit" 
                            title="Chỉnh sửa"
                            onClick={() => handleEdit(chapter)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-delete" 
                            title="Xóa"
                            onClick={() => handleDelete(chapter)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-table-msg">
                      Không tìm thấy dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && filteredChapters.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị <span>{startIndex + 1}</span> đến <span>{Math.min(endIndex, filteredChapters.length)}</span> trong số <span>{filteredChapters.length}</span> chương
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn" 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} /> Trước
            </button>
            
            <div className="page-numbers">
              {getPageNumbers(currentPage, totalPages).map((item, index) => (
                item === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={item}
                    className={`page-num-btn ${currentPage === item ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
              ))}
            </div>

            <button 
              className="page-btn" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              Sau <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterTable;
