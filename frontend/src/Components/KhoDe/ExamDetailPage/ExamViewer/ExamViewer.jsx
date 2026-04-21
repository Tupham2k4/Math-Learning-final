import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./ExamViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ExamViewer = ({ pdfSrc, onClose, title, isFullPage = false }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const containerRef = useRef(null);
  const pageRefs = useRef([]);

  // Cập nhật width khi zoom hoặc resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = Math.max(600, containerRef.current.clientWidth - 24);
        setPageWidth(Math.floor(w * zoom));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [zoom]);

  // Tạo refs cho từng trang
  useEffect(() => {
    pageRefs.current = Array.from({ length: numPages || 0 }, () =>
      React.createRef(),
    );
  }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));

  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));

  const fitWidth = () => {
    if (containerRef.current) {
      const w = Math.max(600, containerRef.current.clientWidth - 24);
      setPageWidth(w);
      setZoom(1);
    }
  };

  const goToPage = (n) => {
    if (!n || n < 1 || n > numPages) return;
    setCurrentPage(n);
    const ref = pageRefs.current[n - 1];
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePrev = () => goToPage(Math.max(1, currentPage - 1));

  const handleNext = () => goToPage(Math.min(numPages, currentPage + 1));

  // Theo dõi scroll để cập nhật currentPage
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const idx =
            Number(visible.target.getAttribute("data-page-index")) || 0;
          setCurrentPage(idx + 1);
        }
      },
      {
        root: containerRef.current,
        threshold: [0.25, 0.5, 0.75, 1],
      },
    );

    pageRefs.current.forEach((r) => {
      if (r?.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [numPages]);

  return (
    <div
      className={isFullPage ? "exam-viewer-fullpage" : "exam-viewer-overlay"}
    >
      <div
        className={isFullPage ? "exam-viewer-container" : "exam-viewer-card"}
      >
        {/* HEADER */}
        <div className="exam-viewer-header">
          <div className="exam-title">{title || "Exam Viewer"}</div>

          <div className="exam-controls">
            <button className="ctrl" onClick={zoomOut} title="Zoom out">
              －
            </button>

            <button className="ctrl" onClick={zoomIn} title="Zoom in">
              ＋
            </button>

            <button className="ctrl" onClick={fitWidth} title="Fit width">
              ⤢
            </button>

            {/* Nút tải PDF */}
            <a href={pdfSrc} download className="ctrl" title="Tải xuống">
              ⬇
            </a>

            <button className="ctrl" onClick={handlePrev} title="Previous">
              ‹
            </button>

            <span className="page-indicator">
              {currentPage} / {numPages || "–"}
            </span>

            <button className="ctrl" onClick={handleNext} title="Next">
              ›
            </button>

            {onClose && (
              <button className="close-btn" onClick={onClose}>
                Đóng
              </button>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="exam-viewer-body">
          {/* KHU VỰC SCROLL PDF */}
          <div className="pdf-scroll-area" ref={containerRef}>
            <Document
              file={pdfSrc}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="loading">Đang tải...</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`page_${index + 1}`}
                  ref={pageRefs.current[index]}
                  data-page-index={index}
                  className="pdf-page-wrap"
                >
                  <Page pageNumber={index + 1} width={pageWidth} loading="" />
                </div>
              ))}
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamViewer;
