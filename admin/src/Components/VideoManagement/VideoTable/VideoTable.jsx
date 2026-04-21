import React from 'react';
import EmptyVideoState from '../EmptyVideoState/EmptyVideoState';
import VideoTableRow from '../VideoTableRow/VideoTableRow';
import './VideoTable.css';

const VideoTable = ({ videos, currentPage = 1, limit = 10, onView, onEdit, onDelete }) => {
    return (
        <div className="video-table-container">
            {videos && videos.length > 0 ? (
                <div className="video-table-wrapper">
                    <table className="video-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên video bài giảng</th>
                                <th>Lớp</th>
                                <th>Tên chương</th>
                                <th>Ngày tạo</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video, index) => (
                                <VideoTableRow 
                                    key={video._id || index}
                                    video={video}
                                    index={index}
                                    currentPage={currentPage}
                                    limit={limit}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyVideoState />
            )}
        </div>
    );
};

export default VideoTable;