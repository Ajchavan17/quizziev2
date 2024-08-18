// src/pages/Dashboard/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const handleLogout = () => {
    logout(); // Call the logout function to clear the authentication state
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <div className="nav-item-1">
          <h2>QUIZZIE</h2>
        </div>
        <div className="nav-item-2">
          <button>Dashboard</button>
          <button>Analytics</button>
          <button>Create Quiz</button>
        </div>
        <div className="nav-item-3"></div>
      </div>
    </div>
  );
};

export default Dashboard;
