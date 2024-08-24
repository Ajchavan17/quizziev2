import React, { useEffect, useState } from "react";
import "./DashboardContent.css";
import eyeIcon from "../assets/eyeIcon.svg";

function DashboardContent() {
  const [tredndingQuizData, setTredndingQuizData] = useState([]);
  const [quizCount, setQuizCount] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/myquizzes`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const totalImpressions = data.reduce(
          (acc, quiz) => acc + quiz.views,
          0
        );
        setTotalImpressions(totalImpressions);

        const filteredData = data.filter((quiz) => quiz.views > 10);
        // Sort the data by view count in descending order
        const sortedData = filteredData.sort((a, b) => b.views - a.views);

        setTredndingQuizData(sortedData);
        setQuizCount(data.length);
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, [userToken]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
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
            <h1>110</h1>
            <p>questions</p>
          </div>
          <p>Created</p>
        </div>
        <div className="quiz-count-3">
          <div>
            <h1>{totalImpressions}</h1>
            <p>Total</p>
          </div>
          <p>Impressions</p>
        </div>
      </div>
      <div className="trending-quiz-count-container">
        <div className="trending-quiz-container-1">
          <h1>Trending Quizs</h1>
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
