import React from "react";
import Header from "../Components/BaiGiang/Header/Header";
import GradeList from "../Components/BaiGiang/GradeCard/GradeList";
import QuoteSection from "../Components/BaiGiang/Quote/QuoteSection";

const BaiGiang = () => {
  return (
    <div className="bai-giang">
      <Header />
      <GradeList />
      <QuoteSection />
    </div>
  );
};

export default BaiGiang;
