import React from "react";

const MathToolbar = ({ onInsert }) => {
  const symbols = [
    { label: "x²", latex: "x^{2}" },
    { label: "x³", latex: "x^{3}" },
    { label: "√x", latex: "\\sqrt{x}" },
    { label: "a/b", latex: "\\frac{a}{b}" }, // Fraction
    { label: "∑", latex: "\\sum" },
    { label: "∫", latex: "\\int" },
    { label: "π", latex: "\\pi" },
    { label: "θ", latex: "\\theta" },
    { label: "∞", latex: "\\infty" },
    { label: "| |", latex: "|x|" },
    { label: "( )", latex: "(x)" },
    { label: "[ ]", latex: "[x]" },
    { label: "Chế độ Chữ", latex: "\\text{}" },
  ];

  return (
    <div className="math-toolbar">
      {symbols.map((sym, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onInsert(sym.latex)}
          title={sym.label}
          className="toolbar-btn"
        >
          {sym.label}
        </button>
      ))}
    </div>
  );
};

export default MathToolbar;
