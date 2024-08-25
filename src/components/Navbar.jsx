import React, { useState } from "react";

import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <div className="nav-item-1">
          <h2>QUIZZIE</h2>
        </div>
        <div className="nav-item-2">
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to={"/analytics"}
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            Analytics
          </NavLink>
          <NavLink
            to={"/createquiz"}
            className={({ isActive }) => (isActive ? "selected" : "")}
          >
            Create Quiz
          </NavLink>
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
