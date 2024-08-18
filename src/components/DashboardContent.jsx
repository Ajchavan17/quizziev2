import React from "react";
import "./DashboardContent.css";
import eyeIcon from "../assets/eyeIcon.svg";

function DashboardContent() {
  const quizData = [
    {
      name: "Quiz 1",
      attempts: 345,
      createdOn: "4 Sep, 2023",
    },
    {
      name: "Quiz 2",
      attempts: 678,
      createdOn: "10 Aug, 2023",
    },
    {
      name: "Quiz 3",
      attempts: 212,
      createdOn: "22 Jul, 2023",
    },
    {
      name: "Quiz 4",
      attempts: 491,
      createdOn: "15 Sep, 2023",
    },
    {
      name: "Quiz 5",
      attempts: 589,
      createdOn: "1 Aug, 2023",
    },
    {
      name: "Quiz 6",
      attempts: 734,
      createdOn: "12 Jul, 2023",
    },
    {
      name: "Quiz 7",
      attempts: 810,
      createdOn: "30 Jun, 2023",
    },
    {
      name: "Quiz 8",
      attempts: 953,
      createdOn: "18 May, 2023",
    },
    {
      name: "Quiz 9",
      attempts: 429,
      createdOn: "27 Apr, 2023",
    },
    {
      name: "Quiz 10",
      attempts: 667,
      createdOn: "9 Mar, 2023",
    },
    {
      name: "Quiz 11",
      attempts: 390,
      createdOn: "1 Feb, 2023",
    },
    {
      name: "Quiz 12",
      attempts: 528,
      createdOn: "15 Jan, 2023",
    },
  ];

  return (
    <div className="main-container-1">
      <div className="quiz-count-content">
        <div className="quiz-count-1">
          <div>
            <h1>12</h1>
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
            <h1>989</h1>
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
          {quizData.map((quiz, index) => (
            <div key={index} className="trending-quiz-box">
              <div className="trending-quiz-name-attempt">
                <h1>{quiz.name}</h1>
                <span>
                  <p>{quiz.attempts}</p>
                  <img src={eyeIcon} alt="" />
                </span>
              </div>
              <div className="created-dt-container">
                <p>Created on : {quiz.createdOn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
