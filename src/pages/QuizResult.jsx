import React from "react";
import "./QuizResult.css";
import { useParams, useLocation } from "react-router-dom";

const QuizResult = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const { correctAnswers, totalQuestions } = location.state || {};

  return (
    <div className="result-container">
      <h2>Congrats, Quiz is completed</h2>
      <img
        src="/path/to/trophy/image.png"
        alt="Trophy"
        className="trophy-image"
      />
      <p>
        Your Score is{" "}
        <span className="score">
          {correctAnswers}/{totalQuestions}
        </span>
      </p>
    </div>
  );
};

export default QuizResult;
