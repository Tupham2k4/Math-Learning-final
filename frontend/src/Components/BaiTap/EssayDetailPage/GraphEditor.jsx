import React, { useEffect, useRef, useState } from "react";

const GraphEditor = ({ isOpen, onClose, onSave, initialData }) => {
  const containerRef = useRef(null);
  const calculatorRef = useRef(null);

  useEffect(() => {
    if (isOpen && !window.Desmos) {
      const script = document.createElement("script");
      script.src = "https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"; // Demo key
      script.async = true;
      script.onload = initCalculator;
      document.head.appendChild(script);
    } else if (isOpen) {
      initCalculator();
    }

    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
    };
  }, [isOpen]);

  const initCalculator = () => {
    if (containerRef.current && !calculatorRef.current) {
      calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current);
      if (initialData) {
        calculatorRef.current.setState(initialData);
      }
    }
  };

  const handleSave = () => {
    if (calculatorRef.current) {
      const state = calculatorRef.current.getState();
      calculatorRef.current.asyncScreenshot({ format: 'png' }, (data) => {
        onSave({ state, image: data });
        onClose();
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="math-modal-overlay">
      <div className="math-modal-content">
        <div className="math-modal-header">
          <h3>Vẽ đồ thị Desmos</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div 
          ref={containerRef} 
          style={{ width: "100%", height: "400px" }}
        ></div>
        <div className="math-modal-footer">
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button className="save-btn-primary" onClick={handleSave}>Lưu đồ thị</button>
        </div>
      </div>
    </div>
  );
};

export default GraphEditor;
