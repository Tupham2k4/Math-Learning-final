import React, { useMemo, useState } from "react";
import "./QuizQuestion.css";
import MathMarkdown from "../../Common/MathMarkdown";

const QuizQuestion = ({ quiz }) => {
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const correct = useMemo(() => quiz?.correctAnswer, [quiz]);

  if (!quiz) return null;

  const handlePick = (option) => {
    setSelected(option);
    setIsCorrect(option === correct);
  };

  return (
    <div className="quiz-card" id="quiz">
      <h3 className="lesson-section-title">Câu hỏi trắc nghiệm</h3>
      <div className="quiz-question">
        <MathMarkdown content={quiz.question} />
      </div>

      <div className="quiz-options">
        {quiz.options?.map((opt) => {
          const active = selected === opt;
          const className = [
            "quiz-option",
            active ? "active" : "",
            active && isCorrect === true ? "correct" : "",
            active && isCorrect === false ? "wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={opt}
              type="button"
              className={className}
              onClick={() => handlePick(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {isCorrect !== null && (
        <div className={`quiz-result ${isCorrect ? "correct" : "wrong"}`}>
          {isCorrect ? "Chính xác!" : "Chưa đúng, thử lại nhé."}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
