import React, { useState } from "react";
import "./Createquiz.css";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";

function Createquiz() {
  const [quizName, setQuizName] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("Q&A");
  const navigate = useNavigate();
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming you have the JWT token stored in localStorage
    const token = localStorage.getItem("token");

    const quizData = {
      name: quizName,
      type: selectedTestType,
    };

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/quiz/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Navigate to the next page or show a success message
        navigate(`/quiz/${data._id}/questions`);
      } else {
        // Handle error
        console.error("Error creating quiz:", data.message);
        alert("Error creating quiz: " + data.message);
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error: " + error.message);
    }
  };

  return (
    <>
      <>
        <Analytics />
      </>
      <div className="create-quiz-container">
        <form className="create-quiz-container-box" onSubmit={handleSubmit}>
          <div className="create-quiz-name-container">
            <input
              type="text"
              placeholder="Quiz Name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              required
            />
          </div>
          <div className="create-quiz-type-container">
            <h1>Quiz Type</h1>

            <button
              type="button"
              onClick={() => setSelectedTestType("Q&A")}
              className={selectedTestType === "Q&A" ? "selectedTestType" : ""}
            >
              Q&A
            </button>
            <button
              type="button"
              onClick={() => setSelectedTestType("Poll Type")}
              className={
                selectedTestType === "Poll Type" ? "selectedTestType" : ""
              }
            >
              Poll Type
            </button>
          </div>
          <div className="create-quiz-buttons-container">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button type="submit" className="continue-btn">
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Createquiz;
