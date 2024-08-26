import React, { useEffect, useState } from "react";
import "./AddQuestions.css";
import binIcon from "../assets/binIcon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import QuizPublished from "./QuizPublished";

function AddQuestionsComp() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      optionType: "Text",
      options: [{ text: "" }, { text: "" }],
      correctOption: null,
      timer: "OFF",
    },
  ]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizAttemptURL, setQuizAttemptURL] = useState("");
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [quizType, setQuizType] = useState("Q&A");

  //fetch quiz type and setQuizType
  useEffect(() => {
    fetch(`${VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizType(data.type);
        console.log("Quiz type fetched" + data.type);
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  useEffect(() => {
    console.log("Quiz ID from URL:", quizId);
  }, [quizId]);

  // Ensure the activeQuestionIndex is within bounds whenever questions change
  useEffect(() => {
    if (activeQuestionIndex >= questions.length) {
      setActiveQuestionIndex(questions.length - 1);
    }
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        optionType: "Text",
        options: [{ text: "" }, { text: "" }],
        correctOption: null,
        timer: "OFF",
      },
    ]);
    setActiveQuestionIndex(questions.length);
  };

  const handleInputChange = (e, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex][field] = e.target.value;
    if (field === "optionType") {
      if (e.target.value === "Text&ImageURL") {
        updatedQuestions[activeQuestionIndex].options = [
          { text: "", url: "" },
          { text: "", url: "" },
        ];
      } else {
        updatedQuestions[activeQuestionIndex].options = [
          { text: "" },
          { text: "" },
        ];
      }
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, index, field = "text") => {
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex].options[index][field] =
      e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    const updatedQuestions = [...questions];
    const newOption =
      questions[activeQuestionIndex].optionType === "Text&ImageURL"
        ? { text: "", url: "" }
        : { text: "" };
    updatedQuestions[activeQuestionIndex].options.push(newOption);
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex].options.splice(index, 1);
    if (updatedQuestions[activeQuestionIndex].correctOption === index) {
      updatedQuestions[activeQuestionIndex].correctOption = null;
    }
    setQuestions(updatedQuestions);
  };

  const handleSelectCorrectOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[activeQuestionIndex].correctOption = index;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);

    let newActiveIndex = activeQuestionIndex;
    if (activeQuestionIndex >= updatedQuestions.length) {
      newActiveIndex = updatedQuestions.length - 1;
    }

    setQuestions(updatedQuestions);
    setActiveQuestionIndex(newActiveIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionsData = questions.map((question) => ({
      questionText: question.questionText,
      optionType: question.optionType,
      options: question.options.map((option, index) => ({
        text: option.text,
        url: option.url,
        correct: question.correctOption === index,
      })),
      timer: question.timer === "OFF" ? 0 : parseInt(question.timer),
    }));

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ questions: questionsData }),
        }
      );

      if (response.ok) {
        console.log("All questions added successfully");

        // Redirect to the quiz attempt URL after successful submission
        const quizAttemptURL = `${window.location.origin}/quiz/${quizId}`;
        setQuizAttemptURL(quizAttemptURL);
        setIsSubmitted(true);
      } else {
        console.error("Failed to add questions");
        // Handle error
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  if (questions.length === 0 || !questions[activeQuestionIndex]) {
    return <div>No questions available. Please add a question.</div>;
  }

  return (
    <div className="add-questions-container">
      {isSubmitted ? (
        <QuizPublished quizAttemptURL={quizAttemptURL} />
      ) : (
        <form className="add-questions-container-box" onSubmit={handleSubmit}>
          <div className="add-questions-count-container">
            <div className="counter-questions">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`add-questions-counter ${
                    index === activeQuestionIndex ? "active" : ""
                  }`}
                  onClick={() => setActiveQuestionIndex(index)}
                >
                  <span>{index + 1}</span>
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
              value={questions[activeQuestionIndex].questionText}
              onChange={(e) => handleInputChange(e, "questionText")}
            />
          </div>
          <div className="add-questions-optiontype-container">
            <span>Option Type</span>
            <input
              type="radio"
              name="optionType"
              id="text"
              value="Text"
              checked={questions[activeQuestionIndex].optionType === "Text"}
              onChange={(e) => handleInputChange(e, "optionType")}
            />
            <label htmlFor="text">Text</label>

            <input
              type="radio"
              name="optionType"
              id="imageURL"
              value="ImageURL"
              checked={questions[activeQuestionIndex].optionType === "ImageURL"}
              onChange={(e) => handleInputChange(e, "optionType")}
            />
            <label htmlFor="imageURL">Image URL</label>

            <input
              type="radio"
              name="optionType"
              id="textImageURL"
              value="Text&ImageURL"
              checked={
                questions[activeQuestionIndex].optionType === "Text&ImageURL"
              }
              onChange={(e) => handleInputChange(e, "optionType")}
            />
            <label htmlFor="textImageURL">Text & Image URL</label>
          </div>
          <div className="add-questions-options-container">
            <div className="add-questions-options-container-box">
              {questions[activeQuestionIndex].options.map((option, index) => (
                <div key={index} className="option-input-group">
                  {quizType === "Poll Type" ? null : (
                    <input
                      className="option-input-radio"
                      type="radio"
                      name="correctAnswer"
                      checked={
                        questions[activeQuestionIndex].correctOption === index
                      }
                      onChange={() => handleSelectCorrectOption(index)}
                    />
                  )}
                  <div
                    className={
                      questions[activeQuestionIndex].optionType ===
                      "Text&ImageURL"
                        ? "option-input-for-turl"
                        : ""
                    }
                  >
                    <input
                      className={`${
                        questions[activeQuestionIndex].correctOption === index
                          ? "correct-option"
                          : ""
                      }
                      ${
                        questions[activeQuestionIndex].optionType ===
                        "Text&ImageURL"
                          ? "option-input-for-turl-input-text"
                          : "option-input-input"
                      }
                      }`}
                      type="text"
                      placeholder={`${
                        questions[activeQuestionIndex].optionType === "ImageURL"
                          ? "Image URL"
                          : "Text"
                      } ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(e, index)}
                    />
                    {questions[activeQuestionIndex].optionType ===
                      "Text&ImageURL" && (
                      <input
                        style={
                          questions[activeQuestionIndex].correctOption === index
                            ? {
                                color: "#ffffff !important",
                                background: "#60b84b",
                              }
                            : { zIndex: "1000" }
                        }
                        className={`${
                          questions[activeQuestionIndex].correctOption === index
                            ? "correct-option"
                            : ""
                        }
                        option-input-input
                        }`}
                        type="url"
                        placeholder={`Image URl ${index + 1}`}
                        value={option.url || ""}
                        onChange={(e) => handleOptionChange(e, index, "url")}
                      />
                    )}
                  </div>

                  {questions[activeQuestionIndex].options.length > 2 &&
                    index >= 2 && (
                      <img
                        className={
                          questions[activeQuestionIndex].optionType ===
                          "Text&ImageURL"
                            ? "option-input-bin-v2"
                            : "option-input-bin"
                        }
                        src={binIcon}
                        alt="Delete"
                        onClick={() => handleRemoveOption(index)}
                      />
                    )}
                </div>
              ))}
              {questions[activeQuestionIndex].options.length < 4 && (
                <button
                  className="addOption-btn"
                  type="button"
                  onClick={handleAddOption}
                >
                  Add option
                </button>
              )}
            </div>
            <div className="add-questions-timer-container-box">
              {quizType === "Poll Type" ? null : (
                <div className="timer">
                  <h1>Timer</h1>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange({ target: { value: "OFF" } }, "timer")
                    }
                    className={
                      questions[activeQuestionIndex].timer === "OFF"
                        ? "timer-btn-selected"
                        : "timer-btn"
                    }
                  >
                    OFF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange({ target: { value: "5 Sec" } }, "timer")
                    }
                    className={
                      questions[activeQuestionIndex].timer === "5 Sec"
                        ? "timer-btn-selected"
                        : "timer-btn"
                    }
                  >
                    5 Sec
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        { target: { value: "10 Sec" } },
                        "timer"
                      )
                    }
                    className={
                      questions[activeQuestionIndex].timer === "10 Sec"
                        ? "timer-btn-selected"
                        : "timer-btn"
                    }
                  >
                    10 Sec
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="add-questions-buttons-container">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Create Quiz
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddQuestionsComp;
