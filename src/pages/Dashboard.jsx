import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar handleLogout={handleLogout} />
      </div>
      <div className="content-container"></div>
    </div>
  );
};

export default Dashboard;
