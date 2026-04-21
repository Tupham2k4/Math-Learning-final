import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPageHeader from '../Components/VideoManagement/VideoPageHeader/VideoPageHeader';
import VideoFilterBar from '../Components/VideoManagement/VideoFilterBar/VideoFilterBar';
import VideoTable from '../Components/VideoManagement/VideoTable/VideoTable';
import Pagination from '../Components/AccountManagement/Pagination/Pagination';
import CreateVideoModal from '../Components/VideoManagement/CreateVideoModal/CreateVideoModal';
import VideoDetailModal from '../Components/VideoManagement/VideoDetailModal/VideoDetailModal';
import DeleteVideoModal from '../Components/VideoManagement/DeleteVideoModal/DeleteVideoModal';
import EditVideoModal from '../Components/VideoManagement/EditVideoModal/EditVideoModal';

const VideoManagement = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');

    // States cho Modals / actions
    const [selectedVideoToView, setSelectedVideoToView] = useState(null);
    const [selectedVideoToEdit, setSelectedVideoToEdit] = useState(null);
    const [selectedVideoToDelete, setSelectedVideoToDelete] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [allLessons, setAllLessons] = useState([]); 

    const getAuthHeaders = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const token = userInfo.token || localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
        };
    };

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch dữ liệu: lấy toàn bộ lessons + chapters, lọc lesson có videoUrl
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [lessonRes, chapterRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/lessons'),
                    axios.get('http://localhost:4000/api/chapters')
                ]);

                const rawLessons = lessonRes.data.data || lessonRes.data || [];
                const chaptersData = chapterRes.data.data || chapterRes.data || [];
                const mappedVideos = rawLessons
                    .filter(lesson => lesson.videoUrl && lesson.videoUrl.trim() !== '')
                    .map(lesson => {
                        const isPopulated = typeof lesson.chapterId === 'object' && lesson.chapterId !== null;
                        const cId = isPopulated ? lesson.chapterId._id : lesson.chapterId;
                        const foundChapter = chaptersData.find(c => String(c._id) === String(cId));
                        return {
                            ...lesson,
                            chapterName: (isPopulated ? lesson.chapterId.title : foundChapter?.title) || '-',
                            grade: (isPopulated ? lesson.chapterId.grade : foundChapter?.grade) || '-'
                        };
                    });

                setVideos(mappedVideos);
                setChapters(chaptersData);
                setAllLessons(rawLessons);
            } catch (error) {
                console.error('Lỗi tải danh sách video bài giảng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);

    // Filter theo tìm kiếm và khối lớp
    const filteredVideos = videos.filter(video => {
        const matchSearch = searchTerm
            ? (video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               video.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;

        const videoGradeNum = String(video.grade).replace(/\D/g, '');
        const selectedGradeNum = String(selectedGrade).replace(/\D/g, '');
        const matchGrade = selectedGrade ? videoGradeNum === selectedGradeNum : true;

        return matchSearch && matchGrade;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGrade]);
    const totalPages = Math.ceil(filteredVideos.length / limit) || 1;
    const startIndex = (currentPage - 1) * limit;
    const paginatedVideos = filteredVideos.slice(startIndex, startIndex + limit);

    const handleViewVideo = (video) => {
        setSelectedVideoToView(video);
        console.log('Xem video:', video);
    };

    const handleEditVideo = (video) => {
        setSelectedVideoToEdit(video);
        console.log('Sửa video:', video);
    };

    const handleDeleteVideo = (videoId) => {
        setSelectedVideoToDelete(videoId);
        console.log('Xóa video id:', videoId);
    };
    
    const handleConfirmDelete = async () => {
        if (!selectedVideoToDelete) return;
        try {
            await axios.put(`http://localhost:4000/api/lessons/${selectedVideoToDelete}`, {
                videoUrl: '',
                thumbnail: ''
            }, {
                headers: getAuthHeaders()
            });
            setRefreshKey(prev => prev + 1);
            setSelectedVideoToDelete(null);
        } catch (error) {
            console.error('Lỗi khi xóa video:', error);
            alert(error.response?.data?.message || 'Lỗi khi xóa video bài giảng');
        }
    };

    const handleAddVideoClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCreateVideoSubmit = async (formData) => {
        try {
            // 1. Kiểm tra xem tên video bài giảng nhập vào có tồn tại trong bảng lesson (allLessons) hay không
            const existingLesson = allLessons.find(
                l => l.title?.trim().toLowerCase() === formData.title.trim().toLowerCase()
            );

            if (!existingLesson) {
                throw new Error("Tên bài giảng chưa có, vui lòng thêm tên bài giảng ở mục bài giảng.");
            }

            let thumbnailUrl = existingLesson.thumbnail || '';

            // Nếu có ảnh sửa đổi, upload ảnh trước lên Cloudinary
            if (formData.thumbnailFile) {
                const uploadData = new FormData();
                uploadData.append('image', formData.thumbnailFile);
                
                const res = await axios.post('http://localhost:4000/api/upload/image', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data && res.data.success) {
                    thumbnailUrl = res.data.image_url;
                }
            }

            // Cập nhật record Lesson có sẵn thay vì Create mới
            const payload = {
                videoUrl: formData.videoUrl,
                thumbnail: thumbnailUrl,
                description: formData.description || '', // Cập nhật trực tiếp ở root description
                content: {
                    ...(existingLesson.content || {}),
                    mucTieu: formData.description || existingLesson.content?.mucTieu || ''
                }
            };

            await axios.put(`http://localhost:4000/api/lessons/${existingLesson._id}`, payload, {
                headers: getAuthHeaders()
            });
            
            // Đóng modal và reset data
            setIsCreateModalOpen(false);
            setRefreshKey(prev => prev + 1); // trigger reload
        } catch (error) {
            console.error('Lỗi khi thêm bài giảng:', error);
            throw new Error(error.response?.data?.message || 'Không thể thêm bài giảng mới');
        }
    };

    const handleEditVideoSubmit = async (lessonId, formData) => {
        try {
            // Kiểm tra "Tên không hợp lệ, vui lòng đặt tên khác!" 
            const targetLesson = allLessons.find(
                l => l.title?.trim().toLowerCase() === formData.title.trim().toLowerCase()
            );

            if (!targetLesson) {
                throw new Error("Tên không hợp lệ, vui lòng đặt tên khác!");
            }

            // Tính toán thumbnail
            let thumbnailUrl = targetLesson.thumbnail || '';
            const oldLesson = allLessons.find(l => String(l._id) === String(lessonId));

            if (formData.removeThumbnail) {
                thumbnailUrl = '';
            } else if (!formData.thumbnailFile && oldLesson && String(targetLesson._id) !== String(lessonId)) {
                // Kế thừa lại ảnh cũ nếu họ đổi tên (đổi bài giảng) nhưng không tải ảnh hưởng khác
                thumbnailUrl = oldLesson.thumbnail || '';
            }

            if (formData.thumbnailFile) {
                const uploadData = new FormData();
                uploadData.append('image', formData.thumbnailFile);
                
                const res = await axios.post('http://localhost:4000/api/upload/image', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (res.data && res.data.success) {
                    thumbnailUrl = res.data.image_url;
                }
            }

            const payload = {
                videoUrl: formData.videoUrl,
                thumbnail: thumbnailUrl,
                chapterId: formData.chapterId, // Cập nhật chương mới
                description: formData.description || '', // Ép luôn description ra root để mongoose gán
                content: {
                    ...(targetLesson.content || {}),
                    mucTieu: formData.description || ''
                }
            };

            // Thực hiện điều hướng/shift video nếu Target Lesson khác Current Lesson
            if (String(targetLesson._id) !== String(lessonId)) {
                // Xóa video và thumbnail ở lesson cũ
                await axios.put(`http://localhost:4000/api/lessons/${lessonId}`, {
                    videoUrl: '',
                    thumbnail: ''
                }, { headers: getAuthHeaders() });
            }

            // Cập nhật record đích
            await axios.put(`http://localhost:4000/api/lessons/${targetLesson._id}`, payload, {
                headers: getAuthHeaders()
            });

            setSelectedVideoToEdit(null);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Lỗi khi cập nhật video:', error);
            throw new Error(error.response?.data?.message || error.message || 'Không thể cập nhật video');
        }
    };


    return (
        <div className="video-management-container">
            <VideoPageHeader />

            <VideoFilterBar
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddVideo={handleAddVideoClick}
            />

            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '60px',
                    color: '#9ca3af',
                    fontSize: '15px'
                }}>
                    Đang tải dữ liệu...
                </div>
            ) : (
                <>
                    <VideoTable
                        videos={paginatedVideos}
                        currentPage={currentPage}
                        limit={limit}
                        onView={handleViewVideo}
                        onEdit={handleEditVideo}
                        onDelete={handleDeleteVideo}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <CreateVideoModal 
                isOpen={isCreateModalOpen} 
                onClose={handleCloseCreateModal} 
                onSubmit={handleCreateVideoSubmit} 
                chapters={chapters} 
            />

            <EditVideoModal
                isOpen={!!selectedVideoToEdit}
                onClose={() => setSelectedVideoToEdit(null)}
                selectedLesson={selectedVideoToEdit}
                onSubmit={handleEditVideoSubmit}
                chapters={chapters}
            />

            <VideoDetailModal
                isOpen={!!selectedVideoToView}
                onClose={() => setSelectedVideoToView(null)}
                lesson={selectedVideoToView}
            />

            <DeleteVideoModal
                isOpen={!!selectedVideoToDelete}
                onClose={() => setSelectedVideoToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default VideoManagement;
