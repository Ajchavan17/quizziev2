import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../components/Navbar";
import DashboardContent from "../components/DashboardContent";
import Createquiz from "./Createquiz";
import Analytics from "./Analytics";

const Dashboard = () => {
  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar />
      </div>
      <div className="content-container">
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
