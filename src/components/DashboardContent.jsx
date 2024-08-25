import React, { useEffect, useState } from "react";
import "./DashboardContent.css";
import eyeIcon from "../assets/eyeIcon.svg";

function DashboardContent() {
  const [tredndingQuizData, setTredndingQuizData] = useState([]);
  const [quizCount, setQuizCount] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0); // State for total questions
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    // First fetch to get all quizzes created by the user
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/myquizzes`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        const totalImpressions = data.reduce(
          (acc, quiz) => acc + quiz.views,
          0
        );
        setTotalImpressions(totalImpressions);
        setQuizCount(data.length);

        // Filter and sort the data for trending quizzes
        const filteredData = data.filter((quiz) => quiz.views > 10);
        const sortedData = filteredData.sort((a, b) => b.views - a.views);
        setTredndingQuizData(sortedData);

        // Fetch the questions for each quiz
        let totalQuestions = 0;
        for (const quiz of data) {
          const response = await fetch(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${
              quiz._id
            }`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const quizData = await response.json();
          totalQuestions += quizData.questions.length;
          console.log("Total questions:", totalQuestions);
        }
        setTotalQuestions(totalQuestions);
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, [userToken]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatImpressions = (views) => {
    return views > 1000 ? (views / 1000).toFixed(1) + "K" : views;
  };

  return (
    <div className="main-container-1">
      <div className="quiz-count-content">
        <div className="quiz-count-1">
          <div>
            <h1>{quizCount}</h1>
            <p>Quiz</p>
          </div>
          <p>Created</p>
        </div>
        <div className="quiz-count-2">
          <div>
            <h1>{totalQuestions}</h1>
            <p>Questions</p>
          </div>
          <p>Created</p>
        </div>
        <div className="quiz-count-3">
          <div>
            <h1>{formatImpressions(totalImpressions)}</h1>
            <p>Total</p>
          </div>
          <p>Impressions</p>
        </div>
      </div>
      <div className="trending-quiz-count-container">
        <div className="trending-quiz-container-1">
          <h1>Trending Quizzes</h1>
        </div>
        <div className="trending-quiz-container-2">
          {tredndingQuizData.map((quiz, index) => (
            <div key={index} className="trending-quiz-box">
              <div className="trending-quiz-name-attempt">
                <h1>{quiz.name}</h1>
                <span>
                  <p>{quiz.views}</p>
                  <img src={eyeIcon} alt="" />
                </span>
              </div>
              <div className="created-dt-container">
                <p>Created on : {formatDate(quiz.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
