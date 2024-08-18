import React, { useState } from "react";

import "./Navbar.css";

const Dashboard = ({ handleLogout, setSelectedItem, selectedItem }) => {
  return (
    <div className="main-container">
      <div className="nav-container">
        <div className="nav-item-1">
          <h2>QUIZZIE</h2>
        </div>
        <div className="nav-item-2">
          <button
            className={selectedItem === "Dashboard" ? "selected" : ""}
            onClick={() => setSelectedItem("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={selectedItem === "Analytics" ? "selected" : ""}
            onClick={() => setSelectedItem("Analytics")}
          >
            Analytics
          </button>
          <button
            className={selectedItem === "Create Quiz" ? "selected" : ""}
            onClick={() => setSelectedItem("Create Quiz")}
          >
            Create Quiz
          </button>
        </div>
        <div className="nav-item-3">
          <div />
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
