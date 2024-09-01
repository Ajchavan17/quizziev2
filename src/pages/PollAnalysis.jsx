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

        console.log("Quiz Data:", quizData);
        console.log("Analytics Data:", analyticsData);

        // Process the data to match your component's structure
        const processedData = quizData.questions.map((question) => {
          const analytics = analyticsData.find(
            (a) => a.questionId === question._id
          );

          // Handle cases where no analytics data is found for a question
          const optionsWithCounts = question.options.map((option) => {
            const matchingOption = analytics?.options.find(
              (o) => o.optionId === option._id
            );

            // Added more detailed logging for debugging
            console.log("Question:", question.questionText);
            console.log("Option:", option.text);
            console.log("Matching Option:", matchingOption);

            return {
              text: option.text,
              type: question.optionType,
              url: option.url,
              count: matchingOption ? matchingOption.selectionCount : 0,
            };
          });

          return {
            questionText: question.questionText,
            optionType: question.optionType,
            options: optionsWithCounts,
          };
        });

        setQuizAnalysisData(processedData);
        console.log("Processed Data:", processedData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    let formattedDate = new Date(dateString).toLocaleDateString(
      "en-GB",
      options
    );

    const [day, monthYear, year] = formattedDate.split(" ");
    return `${day} ${monthYear.replace(",", "")}, ${year}`;
  };

  const renderOption = ({ optionType, option }) => {
    switch (optionType) {
      case "Text":
        return <span>{option.text}</span>;
      case "ImageURL":
        return <img src={option.text} alt="Option" />;
      case "Text&ImageURL":
        return (
          <>
            <span>{option.text}</span>
            <img src={option.url} alt="Option" />
          </>
        );
    }
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
                <h1>{quizInfo.name} Question Analysis</h1>
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
                      <div className="quiz-poll-analysis-options">
                        {renderOption({
                          optionType: question.optionType,
                          option,
                        })}
                      </div>
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
