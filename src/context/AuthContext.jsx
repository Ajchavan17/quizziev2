// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token is present in localStorage
    const token = localStorage.getItem("token");
    console.log("Retrieved token from localStorage:", token); // Add this line
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    console.log("Token saved to localStorage:", token); // Add this line
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    console.log("Token removed from localStorage"); // Add this line
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
