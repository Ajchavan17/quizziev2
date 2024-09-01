import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizAttempt.css";

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(null);
  const [timer, setTimer] = useState(0); // initial timer value in seconds
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState("");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
        setQuizType(data.type);
        setTimer(data.questions[0].timer || 0);
        incrementViewCount();
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0 && questions[currentQuestionIndex]?.timer > 0) {
      handleNextQuestion();
    }
  }, [timer]);

  const incrementViewCount = () => {
    fetch(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}/views`,
      { method: "PUT" }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("View count incremented", data.views);
      })
      .catch((error) => console.error("Error incrementing view count:", error));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption =
      selectedOptionIndex !== null
        ? currentQuestion.options[selectedOptionIndex]
        : null;
    const isCorrect = selectedOption?.correct || false;

    if (selectedOptionIndex === null && timer === 0) {
      handleAddAnalytics(null, false); // Send incorrect analytics
    } else if (selectedOption) {
      handleAddAnalytics(selectedOption, isCorrect);
    }

    if (selectedOption) {
      handleAddAnalytics(selectedOption, isCorrect);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setTimer(questions[currentQuestionIndex + 1].timer || 0);
    } else {
      navigate(`/quiz/${quizId}/result`, {
        state: {
          correctAnswers: correctAnswersCount,
          totalQuestions: questions.length,
        },
      });
    }
  };

  const handleAddAnalytics = (option, isCorrect) => {
    if (isCorrect) {
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }

    let requestBody = {};
    if (quizType === "Q&A") {
      requestBody = {
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
    } else if (quizType === "Poll Type") {
      requestBody = {
        questions: [
          {
            questionId: questions[currentQuestionIndex]._id,
            selectedOptionId: option._id,
          },
        ],
      };
      fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/analytics/quiz/${quizId}/poll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
    }
  };

  const handleOptionClick = (index) => {
    setSelectedOptionIndex(index);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-attempt-container">
      <div className="quiz-container">
        <div className="question-header">
          <span>0{`${currentQuestionIndex + 1}/0${questions.length}`}</span>
          {timer > 0 && <span style={{ color: "red" }}>{`00:${timer}s`}</span>}
        </div>
        <div className="question-text">
          Your question text comes here, its a sample text.
        </div>
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`option-container ${
                selectedOptionIndex === index ? "selected-option" : ""
              }`}
            >
              {currentQuestion.optionType === "Text" && (
                <button className="option-button">{option.text}</button>
              )}
              {currentQuestion.optionType === "ImageURL" && (
                <img className="option-image-url" src={option.text} alt="" />
              )}
              {currentQuestion.optionType === "Text&ImageURL" && (
                <div className="textimgurl-option">
                  <span>{option.text}</span>
                  <img className="option-image-url" src={option.url} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="next-button"
          onClick={handleNextQuestion}
          disabled={selectedOptionIndex === null}
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default QuizAttempt;
