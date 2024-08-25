import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./QAAnalysis.css";

function QAAnalysis() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`
        );
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/analytics/quiz/${quizId}/qa`
        );
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchQuizData();
    fetchAnalyticsData();
  }, [quizId]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (!quizData || analyticsData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar />
      </div>
      <div className="content-container">
        <div className="quiz-qa-analysis-container">
          <div>
            <div className="quiz-qa-analysis-header">
              <div>
                <h1>{quizData.name} - Quiz Analysis</h1>
              </div>
              <div className="quiz-qa-analysis-info">
                <span>Created On: {formatDate(quizData.createdAt)}</span>
                <span>Impression: {quizData.views}</span>
              </div>
            </div>
          </div>
          <div className="quiz-qa-analysis-question-container">
            {quizData.questions.map((question, index) => {
              const analytics = analyticsData.find(
                (a) => a.questionId === question._id
              );
              return (
                <div key={question._id} className="quiz-qa-analysis-question">
                  <h1>
                    Q.{index + 1} {question.questionText}
                  </h1>
                  <div className="quiz-qa-analysis-options-info">
                    <div className="quiz-qa-analysis-options-attempt">
                      <span>{analytics?.attempts || 0}</span>
                      <span>people Attempted the question</span>
                    </div>
                    <div className="quiz-qa-analysis-options-answered-correct">
                      <span>{analytics?.correctAnswers || 0}</span>
                      <span>people Answered Correctly</span>
                    </div>
                    <div className="quiz-qa-analysis-options-answered-incorrect">
                      <span>{analytics?.incorrectAnswers || 0}</span>
                      <span>people Answered Incorrectly</span>
                    </div>
                  </div>
                  <div className="hr" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QAAnalysis;
