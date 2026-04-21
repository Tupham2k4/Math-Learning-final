import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const MathMarkdown = ({ content }) => {
  const safeContent = typeof content === "string" ? content : "";

  return (
    <ReactMarkdown
      children={safeContent}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
};

export default MathMarkdown;
