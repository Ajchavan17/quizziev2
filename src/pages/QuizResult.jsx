import React, { useEffect, useState } from "react";
import "./QuizResult.css";
import trophyIcon from "../assets/trophyIcon.svg";
import { useParams, useLocation } from "react-router-dom";

const QuizResult = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const [quizType, setQuizType] = useState("Q&A");
  const { correctAnswers, totalQuestions } = location.state || {};
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizType(data.type);
        console.log("Quiz type fetched" + data.type);
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  return (
    <div className="quiz-result-container">
      <div className="result-container">
        {quizType === "Poll Type" ? (
          <h2 className="poll-h2">Thank you for participating in the Poll</h2>
        ) : (
          <>
            <h2>Congrats, Quiz is completed</h2>
            <img src={trophyIcon} alt="Trophy" className="trophy-image" />
            <p>
              Your Score is{" "}
              <span className="score">
                <br />
                {correctAnswers}/{totalQuestions}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
