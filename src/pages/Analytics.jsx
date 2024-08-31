import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Analytics.css";
import shareIcon from "../assets/shareIcon.svg";
import binIcon from "../assets/binIcon.svg";
import editIcon from "../assets/editIcon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddQuestionsComp from "../components/AddQuestionsComp";

function Analytics() {
  const [quizData, setQuizData] = useState([]);
  const [quizToDelete, setQuizToDelete] = useState(null); // Store the quiz ID to be deleted
  const [quizLength, setQuizLength] = useState(quizData.length);
  const [editQuiz, setEditQuiz] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Function to format the impressions
  const formatImpressions = (views) => {
    return views > 1000 ? (views / 1000).toFixed(1) + "K" : views;
  };

  // Fetch quiz data from the API with token authentication
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/myquizzes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data = await response.json();
        const formattedData = data.map((quiz) => ({
          id: quiz._id,
          name: quiz.name,
          createdOn: new Date(quiz.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          impression: formatImpressions(quiz.views),
          type: quiz.type,
        }));
        setQuizData(formattedData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchData();
  }, []);

  const handleShareClick = (quizId) => {
    const shareLink = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        toast.success("Link copied to the clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link: ", error);
        toast.error("Failed to copy link");
      });
  };

  const handleDeleteClick = async (quizId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.ok) {
        // Filter out the deleted quiz from the state
        setQuizData((prevQuizData) =>
          prevQuizData.filter((quiz) => quiz.id !== quizId)
        );
        toast.success("Quiz deleted successfully");
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Error deleting quiz");
    }
    setQuizToDelete(null); // Reset the quiz to delete state
  };

  const handleConfirmDelete = (quizId) => {
    setQuizToDelete(quizId); // Set the quiz ID for deletion confirmation
  };

  const clickConfirmDelete = () => {
    if (quizToDelete) {
      handleDeleteClick(quizToDelete); // Delete the quiz with the stored ID
    }
  };

  const handleCancelDelete = () => {
    setQuizToDelete(null); // Cancel the deletion
  };

  const handleEditClick = async (quizId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/quiz/${quizId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const quizData = await response.json();
        setEditQuiz(quizData);
        setShowEditModal(true);
      } else {
        console.error("Failed to fetch quiz data for editing");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Close the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditQuiz(null);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    let formattedDate = new Date(dateString).toLocaleDateString(
      "en-GB",
      options
    );

    const [day, monthYear, year] = formattedDate.split(" ");
    return `${day} ${monthYear.replace(",", "")}, ${year}`;
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar />
      </div>
      <div className="content-container">
        <div className="quiz-analysis-container">
          <div className="quiz-analysis-header">
            <h1>Quiz Analysis</h1>
          </div>
          <div className="quiz-analysis-table-container">
            {!quizLength === 0 ? (
              <h1
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#ff0000",
                }}
              >
                No quiz found
              </h1>
            ) : (
              <table className="quiz-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created on</th>
                    <th>Impression</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((quiz, index) => (
                    <tr
                      key={quiz.id}
                      className={index % 2 === 0 ? "even" : "odd"}
                    >
                      <td>{index + 1}</td>
                      <td>{quiz.name}</td>
                      <td>{formatDate(quiz.createdOn)}</td>
                      <td>{quiz.impression}</td>
                      <td className="table-icons">
                        <img
                          src={editIcon}
                          alt="editIcon"
                          onClick={() => handleEditClick(quiz.id)}
                        />
                        <img
                          src={binIcon}
                          alt="binIcon"
                          onClick={() => handleConfirmDelete(quiz.id)}
                        />
                        <img
                          src={shareIcon}
                          alt="shareIcon"
                          onClick={() => handleShareClick(quiz.id)}
                        />
                      </td>
                      <td>
                        <a
                          href={
                            quiz.type === "Q&A"
                              ? `/analytics/qa/${quiz.id}`
                              : "" || quiz.type === "Poll Type"
                              ? `/analytics/poll/${quiz.id}`
                              : ""
                          }
                          className="analysis-link"
                        >
                          Question Wise Analysis
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      {quizToDelete && (
        <div className="delete-flotware">
          <div className="delete-flotware-container">
            <div className="delete-header-container">
              <h1>Are you confirm you </h1>
              <h1>want to delete ?</h1>
            </div>
            <div className="delete-flotware-buttons-container">
              <button className="continue-btn" onClick={clickConfirmDelete}>
                Confirm Delete
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <AddQuestionsComp
          mode={"edit"}
          quizId={editQuiz?._id}
          quizData={editQuiz}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}

export default Analytics;
