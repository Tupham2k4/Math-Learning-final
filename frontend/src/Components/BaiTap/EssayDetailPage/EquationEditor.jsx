import React, { useEffect, useRef } from "react";
import "mathlive";

const EquationEditor = ({ value, onChange, mathfieldRef }) => {
  const internalRef = useRef(null);

  useEffect(() => {
    const mf = internalRef.current;
    if (!mf) return;

    // Cấu hình MathLive
    mf.setOptions({
      smartMode: false, // tắt tự chuyển sang math mode
      defaultMode: "text", // mặc định gõ text
      virtualKeyboardMode: "onfocus",
      inlineShortcuts: {}, // tắt shortcut tự động
      mathModeSpace: " ", // space bình thường
      removeExtraneousParentheses: false,
    });

    // set giá trị ban đầu
    mf.setValue(value || "", { format: "latex" });

    // Khi nội dung thay đổi
    const handleInput = () => {
      const latex = mf.getValue();
      if (onChange) onChange(latex);
    };

    // Xử lý phím
    const handleKeyDown = (e) => {
      // Enter xuống dòng
      if (e.key === "Enter") {
        e.preventDefault();
        mf.insert("\\\\");
      }
    };

    mf.addEventListener("input", handleInput);
    mf.addEventListener("keydown", handleKeyDown);

    return () => {
      mf.removeEventListener("input", handleInput);
      mf.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChange]);

  // Sync nếu value thay đổi từ ngoài (toolbar, reset, ...)
  useEffect(() => {
    const mf = internalRef.current;
    if (!mf) return;

    if (mf.getValue() !== value) {
      mf.setValue(value || "", { format: "latex" });
    }
  }, [value]);

  // expose ref ra ngoài
  useEffect(() => {
    if (mathfieldRef) {
      mathfieldRef.current = internalRef.current;
    }
  }, [mathfieldRef]);

  return (
    <div className="equation-editor-container">
      <math-field
        ref={internalRef}
        style={{
          width: "100%",
          minHeight: "160px",
          padding: "12px",
          fontSize: "18px",
          border: "1px solid #4CAF50",
          borderRadius: "8px",
          background: "#fff",
          display: "block",
          fontFamily: "Segoe UI, Arial, sans-serif",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
};

export default EquationEditor;
