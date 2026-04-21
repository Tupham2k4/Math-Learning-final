import React from "react";
import "./WatchVideo.css";

const VideoPlayer = ({ video }) => {
  if (!video) return null;

  const isYouTube = video.videoUrl && (video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be"));

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v");
      } catch (e) {
        // Fallback for parsing
        const params = url.split("?")[1];
        if (params) {
          const urlParams = new URLSearchParams(params);
          videoId = urlParams.get("v");
        }
      }
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : url;
  };

  const finalSrc = isYouTube ? getYouTubeEmbedUrl(video.videoUrl) : video.videoUrl;

  return (
    <div className="video-player-card" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      {!video.videoUrl ? (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px 24px', borderRadius: '20px', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
            Chưa có video
          </div>
        </div>
      ) : isYouTube ? (
        <iframe
          src={finalSrc}
          title="Video bài giảng"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <video
          className="video-player-element"
          src={finalSrc}
          controls
          poster={video.thumbnail}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
