import React, { useEffect, useState } from "react";
import "./AddQuestions.css";
import binIcon from "../assets/binIcon.svg";
import { useParams } from "react-router-dom";

function AddQuestionsComp() {
  const { quizId } = useParams();
  console.log("Quiz ID:", quizId);
  const [questions, setQuestions] = useState([1]);
  const [options, setOptions] = useState([1, 2]);
  const [timerSelected, setTimerSelected] = useState("OFF");
  const [correctOption, setCorrectOption] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [optionType, setOptionType] = useState("");
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    console.log("Quiz ID from URL:", quizId);
  }, [quizId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, questions.length + 1]);
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    setOptions([...options, options.length + 1]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
    if (correctOption === index) {
      setCorrectOption(null);
    }
  };

  const handleSelectCorrectOption = (index) => {
    setCorrectOption(index);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const optionsData = options.map((_, index) => ({
      text: document.querySelectorAll(".option-input-input")[index].value,
      correct: correctOption === index,
    }));

    const token = localStorage.getItem("token");

    const requestBody = {
      questionText,
      optionType,
      options: optionsData,
      timer: timerSelected === "OFF" ? 0 : parseInt(timerSelected),
    };

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Question added successfully");
        // Handle success (e.g., redirect, clear form, etc.)
      } else {
        console.error("Failed to add question");
        // Handle error
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="add-questions-container">
      <form className="add-questions-container-box" onSubmit={handleSubmit}>
        <div className="add-questions-count-container">
          <div className="counter-questions">
            {questions.map((questionNumber, index) => (
              <div key={index} className="add-questions-counter">
                <span>{questionNumber}</span>
                {index > 0 && (
                  <span
                    className="question-close-icon"
                    onClick={() => handleRemoveQuestion(index)}
                  >
                    x
                  </span>
                )}
              </div>
            ))}

            {questions.length < 5 && (
              <div className="add-questions-icon">
                <span onClick={handleAddQuestion}>+</span>
              </div>
            )}
          </div>
          <div className="text-content">
            <span>Max 5 questions</span>
          </div>
        </div>
        <div className="add-questions-question-container">
          <input
            type="text"
            placeholder="Question Type"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div className="add-questions-optiontype-container">
          <span>Option Type</span>
          <input
            type="radio"
            name="optionType"
            id="text"
            value="Text"
            checked={optionType === "Text"}
            onChange={(e) => setOptionType(e.target.value)}
          />
          <label htmlFor="text">Text</label>

          <input
            type="radio"
            name="optionType"
            id="imageURL"
            value="ImageURL"
            checked={optionType === "ImageURL"}
            onChange={(e) => setOptionType(e.target.value)}
          />
          <label htmlFor="imageURL">Image URL</label>

          <input
            type="radio"
            name="optionType"
            id="textImageURL"
            value="Text&ImageURL"
            checked={optionType === "Text&ImageURL"}
            onChange={(e) => setOptionType(e.target.value)}
          />
          <label htmlFor="textImageURL">Text & Image URL</label>
        </div>
        <div className="add-questions-options-container">
          <div className="add-questions-options-container-box">
            {options.map((option, index) => (
              <div key={index} className="option-input-group">
                <input
                  className="option-input-radio"
                  type="radio"
                  name="correctAnswer"
                  checked={correctOption === index}
                  onChange={() => handleSelectCorrectOption(index)}
                />
                <input
                  className="option-input-input"
                  type="text"
                  placeholder={`Text ${index + 1}`}
                />
                {options.length > 2 && index >= 2 && (
                  <img
                    className="option-input-bin"
                    src={binIcon}
                    alt="Delete"
                    onClick={() => handleRemoveOption(index)}
                  />
                )}
              </div>
            ))}
            {options.length < 4 && (
              <button className="addOption-btn" onClick={handleAddOption}>
                Add option
              </button>
            )}
          </div>
          <div className="add-questions-timer-container-box">
            <div className="timer">
              <h1>Timer</h1>
              <button
                type="button"
                onClick={() => setTimerSelected("OFF")}
                className={
                  timerSelected === "OFF" ? "timer-btn-selected" : "timer-btn"
                }
              >
                OFF
              </button>
              <button
                type="button"
                onClick={() => setTimerSelected("5 Sec")}
                className={
                  timerSelected === "5 Sec" ? "timer-btn-selected" : "timer-btn"
                }
              >
                5 Sec
              </button>
              <button
                type="button"
                onClick={() => setTimerSelected("10 Sec")}
                className={
                  timerSelected === "10 Sec"
                    ? "timer-btn-selected"
                    : "timer-btn"
                }
              >
                10 Sec
              </button>
            </div>
          </div>
        </div>
        <div className="add-questions-buttons-container">
          <button type="button" className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="continue-btn">
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestionsComp;
