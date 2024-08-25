import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const VITE_REACT_APP_BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${VITE_REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Logged in successfully!");
        console.log("Token received:", data.token);
        login(data.token);
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
        setFormError(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
      setFormError("Server error");
    }
  };

  const handleRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-header">
          <h2>QUIZZIE</h2>
          <div className="toggle-buttons">
            <button onClick={handleRedirect}>Sign Up</button>
            <button className="active">Log In</button>
          </div>
        </div>
        {formError && <div className="error-message">{formError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="from-contianer">
            <div className="form-fields-title">
              <h1>Email</h1>
              <h1>Password</h1>
            </div>
            <div className="form-fields-input">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="submit-btn">
              Log In
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Login;
