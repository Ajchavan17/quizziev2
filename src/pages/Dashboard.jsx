import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../components/Navbar";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Dashboard"); // Default selected item is "Dashboard"

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <Navbar
          handleLogout={handleLogout}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
        />
      </div>
      <div className="content-container">
        {/* if selectedItem is dashboard, render dashboard content */}
        {selectedItem === "Dashboard" && <DashboardContent />}
      </div>
    </div>
  );
};

export default Dashboard;
