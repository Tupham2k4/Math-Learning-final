import React, { useState } from 'react';
import ChapterLessonHeader from '../Components/ChapterLessonManagement/ChapterLessonHeader/ChapterLessonHeader';
import ChapterStatsCards from '../Components/ChapterLessonManagement/ChapterStatsCards/ChapterStatsCards';
import ChapterFilterBar from '../Components/ChapterLessonManagement/ChapterFilterBar/ChapterFilterBar';
import ChapterTable from '../Components/ChapterLessonManagement/ChapterTable/ChapterTable';
import LessonTable from '../Components/ChapterLessonManagement/LessonTable/LessonTable';
import AddChapterModal from '../Components/ChapterLessonManagement/AddChapterModal/AddChapterModal';
import EditChapterModal from '../Components/ChapterLessonManagement/EditChapterModal/EditChapterModal';
import AddLessonModal from '../Components/ChapterLessonManagement/AddLessonModal/AddLessonModal';
import EditLessonModal from '../Components/ChapterLessonManagement/EditLessonModal/EditLessonModal';
import DeleteChapterModal from '../Components/ChapterLessonManagement/DeleteChapterModal/DeleteChapterModal';
import axios from 'axios';

const ChapterManagement = () => {
    const [selectedGrade, setSelectedGrade] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [isEditChapterModalOpen, setIsEditChapterModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [isDeleteChapterModalOpen, setIsDeleteChapterModalOpen] = useState(false);
    const [deletingChapter, setDeletingChapter] = useState(null);
    const [refreshChapterKey, setRefreshChapterKey] = useState(0);
    const [refreshLessonKey, setRefreshLessonKey] = useState(0);
    const handleAddChapter = () => setIsChapterModalOpen(true);
    
    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setIsEditChapterModalOpen(true);
    };

    const onChapterAdded = () => {
        setIsChapterModalOpen(false);
        setRefreshChapterKey(prev => prev + 1);
    };

    const onChapterEdited = () => {
        setIsEditChapterModalOpen(false);
        setEditingChapter(null);
        setRefreshChapterKey(prev => prev + 1);
    };

    const handleDeleteChapterBtn = (chapter) => {
        setDeletingChapter(chapter);
        setIsDeleteChapterModalOpen(true);
    };

    const confirmDeleteChapter = async () => {
        if (!deletingChapter) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:4000/api/chapters/${deletingChapter._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data && res.data.success) {
                alert("Đã xóa chương và toàn bộ dữ liệu liên quan thành công.");
                setIsDeleteChapterModalOpen(false);
                setDeletingChapter(null);
                setRefreshChapterKey(prev => prev + 1);
                setRefreshLessonKey(prev => prev + 1);
            }
        } catch (error) {
            console.error("Lỗi xóa chương:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa dữ liệu liên quan.");
        }
    };

    // --- LESSON LOGIC ---
    const handleAddLesson = () => setIsAddLessonModalOpen(true);

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
        setIsEditLessonModalOpen(true);
    };

    const onLessonAdded = () => {
        setIsAddLessonModalOpen(false);
        setRefreshLessonKey(prev => prev + 1);
    };

    const onLessonEdited = () => {
        setIsEditLessonModalOpen(false);
        setEditingLesson(null);
        setRefreshLessonKey(prev => prev + 1);
    };

    return (
        <div className="chapter-management-page">
            <ChapterLessonHeader/>
            <ChapterStatsCards/>
            <ChapterFilterBar 
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddChapter={handleAddChapter}
                onAddLesson={handleAddLesson}
            />
            
            <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#111827'}}>Danh sách chương học</h3>
            <ChapterTable 
                selectedGrade={selectedGrade}
                searchTerm={searchTerm}
                refreshKey={refreshChapterKey}
                onEditChapter={handleEditChapter}
                onDeleteChapter={handleDeleteChapterBtn}
            />

            <h3 style={{fontSize: '18px', fontWeight: '700', marginTop: '24px', marginBottom: '16px', color: '#111827'}}>Danh sách bài giảng</h3>
            <LessonTable 
                selectedGrade={selectedGrade}
                searchTerm={searchTerm}
                refreshKey={refreshLessonKey}
                onEditLesson={handleEditLesson}
            />

            <AddChapterModal 
                isOpen={isChapterModalOpen}
                onClose={() => setIsChapterModalOpen(false)}
                onSuccess={onChapterAdded}
            />

            <EditChapterModal 
                isOpen={isEditChapterModalOpen}
                onClose={() => setIsEditChapterModalOpen(false)}
                onSuccess={onChapterEdited}
                chapterData={editingChapter}
            />

            <AddLessonModal
                isOpen={isAddLessonModalOpen}
                onClose={() => setIsAddLessonModalOpen(false)}
                onSuccess={onLessonAdded}
            />

            <EditLessonModal
                isOpen={isEditLessonModalOpen}
                onClose={() => setIsEditLessonModalOpen(false)}
                onSuccess={onLessonEdited}
                lessonData={editingLesson}
            />

            <DeleteChapterModal
                isOpen={isDeleteChapterModalOpen}
                onClose={() => setIsDeleteChapterModalOpen(false)}
                onConfirm={confirmDeleteChapter}
                chapter={deletingChapter}
            />
        </div>
    );
};

export default ChapterManagement;