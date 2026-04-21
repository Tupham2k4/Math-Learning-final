import React from "react";
import Header from "../Components/BaiTap/Header/Header";
import ExerciseList from "../Components/BaiTap/ExerciseCard/ExerciseList";
import QuoteSection from "../Components/BaiGiang/Quote/QuoteSection";
const BaiTap = () => {
  return (
    <div className="bai-tap">
      <Header />
      <ExerciseList />
      <QuoteSection />
    </div>
  );
};

export default BaiTap;
