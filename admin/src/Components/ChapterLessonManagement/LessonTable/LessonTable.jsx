import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import './LessonTable.css';

const LessonTable = ({ selectedGrade, searchTerm, refreshKey, onEditLesson }) => {
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Hàm xử lý việc lấy dữ liệu từ API
      const [lessonsRes, chaptersRes] = await Promise.all([
        axios.get('http://localhost:4000/api/lessons'),
        axios.get('http://localhost:4000/api/chapters')
      ]);

      const lessonsData = lessonsRes.data.data || lessonsRes.data || [];
      const chaptersData = chaptersRes.data.data || chaptersRes.data || [];

      setLessons(lessonsData);
      setChapters(chaptersData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài học:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý việc lấy dữ liệu từ API
  const getChapterInfo = (lesson) => {
    if (lesson.chapterId && lesson.chapterId.title) {
        return { 
            title: lesson.chapterId.title, 
            grade: lesson.chapterId.grade || lesson.grade 
        };
    }
    const matchedChapter = chapters.find(c => 
        c._id === lesson.chapterId || c._id === lesson.chapterId?._id
    );
    
    if (matchedChapter) {
        return {
            title: matchedChapter.title,
            grade: matchedChapter.grade || lesson.grade
        };
    }

    return { title: 'Không rõ', grade: lesson.grade || 'N/A' };
  };

  // 1. Áp dụng Filter & Search
  const filteredLessons = lessons.filter(lesson => {
    const chapterInfo = getChapterInfo(lesson);
    const lessonGrade = chapterInfo.grade?.toString() || "";

    // Lọc khối lớp
    const matchGrade = selectedGrade 
        ? (lessonGrade === selectedGrade || `Lớp ${lessonGrade}` === selectedGrade || lessonGrade.includes(selectedGrade.replace('Lớp ', '')))
        : true;
        
    // Lọc từ khóa tìm kiếm (theo tên bài học)
    const combinedSearchText = `${lesson.title} ${chapterInfo.title}`.toLowerCase();
    const matchSearch = searchTerm 
        ? combinedSearchText.includes(searchTerm.toLowerCase())
        : true;

    return matchGrade && matchSearch;
  });

  // Reset trang về 1 mỗi khi đổi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, searchTerm]);

  // 2. Phân trang
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLessons = filteredLessons.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEdit = (lesson) => {
    if(onEditLesson) {
        onEditLesson(lesson);
    }
  };

  const handleDelete = (id) => {
    console.log("Delete lesson", id);
    if(window.confirm('Bạn có chắc chắn muốn xóa bài này?')) {
      // TODO: Xóa
    }
  };

  // Hàm tính toán danh sách phím trang hiển thị, chống tràn
  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="lesson-table-wrapper">
      <div className="lesson-table-container">
        {loading ? (
          <div className="lesson-table-loading">Đang tải dữ liệu bài học...</div>
        ) : (
          <div className="table-responsive">
            <table className="lesson-table">
              <thead>
                <tr>
                  <th width="8%">STT</th>
                  <th width="35%">Tên bài</th>
                  <th width="30%">Tên chương</th>
                  <th width="12%">Khối lớp</th>
                  <th width="15%" className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentLessons.length > 0 ? (
                  currentLessons.map((lesson, index) => {
                    const chapterInfo = getChapterInfo(lesson);
                    return (
                      <tr key={lesson._id || index}>
                        <td>{startIndex + index + 1}</td>
                        <td className="lesson-title-cell">{lesson.title}</td>
                        <td className="chapter-name-cell">
                          <BookOpen size={14} className="chapter-icon" />
                          {chapterInfo.title}
                        </td>
                        <td>
                          <span className="lesson-grade-badge">
                            {chapterInfo.grade.toString().includes('Khối') ? chapterInfo.grade : `Lớp ${chapterInfo.grade}`}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="action-buttons">
                            <button 
                              className="btn-edit-lesson" 
                              title="Chỉnh sửa"
                              onClick={() => handleEdit(lesson)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn-delete-lesson" 
                              title="Xóa"
                              onClick={() => handleDelete(lesson._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-table-msg">
                      Không tìm thấy bài học phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredLessons.length > 0 && (
        <div className="lesson-pagination-container">
          <div className="lesson-pagination-info">
            Hiển thị <span>{startIndex + 1}</span> đến <span>{Math.min(endIndex, filteredLessons.length)}</span> trong số <span>{filteredLessons.length}</span> bài
          </div>
          <div className="lesson-pagination-controls">
            <button 
              className="lesson-page-btn" 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} /> Trước
            </button>
            
            <div className="lesson-page-numbers">
              {getPageNumbers(currentPage, totalPages).map((item, index) => (
                item === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={item}
                    className={`lesson-page-num-btn ${currentPage === item ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
              ))}
            </div>

            <button 
              className="lesson-page-btn" 
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

export default LessonTable;
