import React, { useEffect, useRef, useState } from "react";

const GeometryEditor = ({ isOpen, onClose, onSave, initialData }) => {
  const containerRef = useRef(null);
  const appletRef = useRef(null);

  useEffect(() => {
    if (isOpen && !window.GGBApplet) {
      const script = document.createElement("script");
      script.src = "https://www.geogebra.org/apps/deployggb.js";
      script.async = true;
      script.onload = initGeoGebra;
      document.head.appendChild(script);
    } else if (isOpen) {
      initGeoGebra();
    }
  }, [isOpen]);

  const initGeoGebra = () => {
    if (containerRef.current) {
      const params = {
        appName: "geometry",
        width: 800,
        height: 400,
        showToolBar: true,
        showAlgebraInput: true,
        showMenuBar: true,
        appletOnLoad: (api) => {
          appletRef.current = api;
          if (initialData) {
            api.setBase64(initialData);
          }
        },
      };
      const applet = new window.GGBApplet(params, true);
      applet.inject(containerRef.current);
    }
  };

  const handleSave = () => {
    if (appletRef.current) {
      const base64 = appletRef.current.getBase64();
      const image = appletRef.current.getPNGBase64(1, false, 72);
      onSave({ state: base64, image: "data:image/png;base64," + image });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="math-modal-overlay">
      <div className="math-modal-content geometry-modal">
        <div className="math-modal-header">
          <h3>Vẽ hình GeoGebra</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div 
          id="ggb-element"
          ref={containerRef} 
          style={{ width: "100%", height: "400px" }}
        ></div>
        <div className="math-modal-footer">
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button className="save-btn-primary" onClick={handleSave}>Lưu hình vẽ</button>
        </div>
      </div>
    </div>
  );
};

export default GeometryEditor;
