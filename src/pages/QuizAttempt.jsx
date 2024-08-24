import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizAttempt.css";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [timer, setTimer] = useState(10); // initial timer value in seconds
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
        setTimer(data.questions[0].timer || 0);
        console.log("Quiz fetched");
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && questions[currentQuestionIndex].timer > 0) {
      handleNextQuestion();
    }
  }, [timer]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      setTimer(questions[currentQuestionIndex + 1].timer || 0);
    } else {
      // Handle quiz completion, maybe navigate to a result page
      navigate(`/quiz/${quizId}/result`, {
        state: {
          correctAnswers: correctAnswersCount,
          totalQuestions: questions.length,
        },
      });
    }
  };

  const handleOptionClick = (option, isCorrect) => {
    if (isCorrect) {
      setCorrectAnswersCount(correctAnswersCount + 1);
    }
    // Save the response to the analytics endpoint
    const requestBody = {
      questions: [
        {
          questionId: questions[currentQuestionIndex]._id,
          isCorrect,
        },
      ],
    };

    fetch(
      `${
        import.meta.env.VITE_REACT_APP_BACKEND_URL
      }/api/analytics/quiz/${quizId}/qa`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    handleNextQuestion();
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="question-header">
        <span>{`${currentQuestionIndex + 1}/${questions.length}`}</span>
        <span style={{ color: "red" }}>{`00:${timer}s`}</span>
      </div>
      <div className="question-text">{currentQuestion.questionText}</div>
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option, option.correct)}
            className="option-button"
          >
            {option.text}
          </button>
        ))}
      </div>
      <button className="next-button" onClick={handleNextQuestion}>
        {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuizAttempt;
