import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./QuizPublished.css";

function QuizPublished({ quizAttemptURL }) {
  const handleShare = () => {
    // Get the link from the <a> tag
    const link = document.querySelector(".link-container a").href;

    // Copy the link to the clipboard
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Show the toast notification
        toast.success("Link copied to the clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="congrats-container-box">
      <div className="text-container">
        <h1>Congrats your Quiz is Published!</h1>
      </div>
      <div className="link-container">
        <a href={quizAttemptURL}>{quizAttemptURL}</a>
      </div>
      <button className="share-btn" onClick={handleShare}>
        Share
      </button>

      {/* Add ToastContainer to display the toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default QuizPublished;
