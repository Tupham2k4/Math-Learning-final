import React from "react";
import Header from "../Components/KhoDe/Header/Header";
import QuestionList from "../Components/KhoDe/QuestionCard/QuestionList";
import QuestionList2 from "../Components/KhoDe/QuestionCard/QuestionList2";
import QuoteSection from "../Components/BaiGiang/Quote/QuoteSection";
const KhoDe = () => {
  return (
    <div className="kho-de">
      <Header />
      <h1
        style={{
          color: "#34A853",
          fontWeight: "bold",
          paddingLeft: "25px",
          marginTop: "15px",
        }}
      >
        Kho đề theo từng lớp
      </h1>
      <QuestionList />
      <h1
        style={{
          color: "#34A853",
          fontWeight: "bold",
          paddingLeft: "25px",
          marginTop: "15px",
        }}
      >
        Đặc biệt
      </h1>
      <QuestionList2 />
      <QuoteSection />
    </div>
  );
};

export default KhoDe;
