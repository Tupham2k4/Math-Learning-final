import React from "react";
import QuestionAccordion from "../QuestionAccordion/QuestionAccordion";
import "./QuestionList.css";

const QuestionList = ({ questionSections, themeColor }) => {
  return (
    <div className="question-list">
      {questionSections && questionSections.length > 0 ? (
        questionSections.map((section, index) => (
          <QuestionAccordion
            key={section.id}
            chapter={section}
            exams={section.exams}
            defaultOpen={index === 0}
            themeColor={themeColor}
          />
        ))
      ) : (
        <div className="no-questions">
          <p>Hiện chưa có đề thi nào.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
