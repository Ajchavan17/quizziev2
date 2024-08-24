// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddQuestions from "./pages/AddQuestions";
import QuizAttempt from "./pages/QuizAttempt";
import QuizResult from "./pages/QuizResult";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quiz/:quizId/questions" element={<AddQuestions />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/quiz/:quizId" element={<QuizAttempt />} />
          <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
