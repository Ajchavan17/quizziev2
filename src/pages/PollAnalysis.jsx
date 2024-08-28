import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./PollAnalysis.css";
import { useParams } from "react-router-dom";

function PollAnalysis() {
  const [quizAnalysisData, setQuizAnalysisData] = useState([]);
  const [quizInfo, setQuizInfo] = useState({
    name: "",
    createdAt: "",
    views: 0,
  });
  const { quizId } = useParams();

  useEffect(() => {
    // Fetch the quiz data
    const fetchQuizData = async () => {
      try {
        const quizResponse = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`
        );
        const quizData = await quizResponse.json();

        setQuizInfo({
          name: quizData.name,
          createdAt: quizData.createdAt,
          views: quizData.views,
        });

        // Fetch the poll analytics data
        const analyticsResponse = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/analytics/quiz/${quizId}/poll`
        );
        const analyticsData = await analyticsResponse.json();

        // Process the data to match your component's structure
        const processedData = quizData.questions.map((question) => {
          const analytics = analyticsData.find(
            (a) => a.questionId === question._id
          );

          const optionsWithCounts = question.options.map((option) => {
            const matchingOption = analytics.options.find(
              (o) => o.optionId === option._id
            );
            return {
              text: option.text,
              count: matchingOption ? matchingOption.selectionCount : 0,
            };
          });

          return {
            questionText: question.questionText,
            options: optionsWithCounts,
          };
        });

        setQuizAnalysisData(processedData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar />
      </div>
      <div className="content-container">
        <div className="quiz-poll-analysis-container">
          <div>
            <div className="quiz-poll-analysis-header">
              <div>
                <h1>{quizInfo.name} - Quiz Analysis</h1>
              </div>
              <div className="quiz-poll-analysis-info">
                <span>Created On: {formatDate(quizInfo.createdAt)}</span>
                <span>Impression: {quizInfo.views}</span>
              </div>
            </div>
          </div>
          <div className="quiz-poll-analysis-question-container">
            {quizAnalysisData.map((question, index) => (
              <div key={index} className="quiz-poll-analysis-question">
                <h1>
                  Q.{index + 1} {question.questionText}
                </h1>
                <div className="quiz-poll-analysis-options-info">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="quiz-poll-analysis-options-attempt"
                    >
                      <span>{option.count}</span>
                      <span>{option.text}</span>
                    </div>
                  ))}
                </div>
                <div className="hr" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollAnalysis;
