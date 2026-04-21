import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./WatchVideo.css";
import SidebarVideo from "./SidebarVideo";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import CommentSection from "./CommentSection";
import RelatedVideoList from "./RelatedVideoList";

const WatchVideo = () => {
  const location = useLocation();
  const { videoId } = useParams(); // Lấy videoId từ URL param
  const state = location.state || {};
  const videoFromState = state.video;
  const gradeNumber = state.grade || 12;

  const [currentVideo, setCurrentVideo] = useState(videoFromState || null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Nếu có video từ state (navigation), sử dụng nó
  useEffect(() => {
    if (videoFromState) {
      setCurrentVideo(videoFromState);
    }
  }, [videoFromState]);

  // Nếu không có video từ state (reload trang), fetch từ API bằng videoId trên URL
  useEffect(() => {
    if (!videoFromState && videoId) {
      const fetchVideo = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:4000/api/lessons/${videoId}`);
          const data = await res.json();
          if (data.success && data.data) {
            setCurrentVideo(data.data);
          }
        } catch (error) {
          console.error("Lỗi khi tải video:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [videoFromState, videoId]);

  // Fetch related videos (cùng chương)
  useEffect(() => {
    if (!currentVideo?.chapterId) return;
    
    fetch(`http://localhost:4000/api/lessons?chapterId=${currentVideo.chapterId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const others = data.data.filter(v => (v._id || v.id) !== (currentVideo._id || currentVideo.id));
          setRelatedVideos(others);
        }
      })
      .catch(console.error);
  }, [currentVideo]);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Đang tải video...</div>;
  if (!currentVideo) return <div style={{padding: '40px', textAlign: 'center'}}>Không tìm thấy video nào.</div>;

  return (
    <div className="watch-video-page">
      <div className="watch-video-inner">
        <aside className="watch-video-sidebar">
          <SidebarVideo 
            currentVideo={currentVideo} 
            onSelectVideo={setCurrentVideo}
            gradeNumber={gradeNumber}
          />
        </aside>

        <main className="watch-video-main">
          <section className="watch-video-main-top">
            <VideoPlayer video={currentVideo} />
            <VideoInfo video={currentVideo} />
            <CommentSection videoId={currentVideo._id || currentVideo.id} />
          </section>

          <section className="watch-video-related-section">
            <RelatedVideoList
              videos={relatedVideos.slice(0, 4)}
              chapterTitle="Khám phá thêm video cùng chủ đề"
              onSelectVideo={setCurrentVideo}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default WatchVideo;
