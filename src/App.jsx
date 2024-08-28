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
import Createquiz from "./pages/Createquiz";
import Analytics from "./pages/Analytics";
import QAAnalysis from "./pages/QAAnalysis";
import PollAnalysis from "./pages/PollAnalysis";

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
          <Route path="/createquiz" element={<Createquiz />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/quiz/:quizId/questions" element={<AddQuestions />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/quiz/:quizId" element={<QuizAttempt />} />
          <Route path="/quiz/:quizId/result" element={<QuizResult />} />
          <Route path="/analytics/qa/:quizId" element={<QAAnalysis />} />
          <Route path="/analytics/poll/:quizId" element={<PollAnalysis />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
