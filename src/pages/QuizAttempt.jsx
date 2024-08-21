import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`
        );
        if (response.ok) {
          const quizData = await response.json();
          setQuiz(quizData);
        } else {
          console.error("Failed to fetch quiz data");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div>
      <h1>{quiz.name}</h1>
      {quiz.questions.map((question, index) => (
        <div key={index}>
          <h2>{question.questionText}</h2>
          {question.options.map((option, idx) => (
            <div key={idx}>
              <label>
                <input type="radio" name={`question-${index}`} />
                {option.text}
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizAttempt;
