import React, { useState } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Invalid name";
        }
        break;
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.match(emailPattern)) {
          error = "Invalid email";
        }
        break;
      case "password":
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!value.match(passwordPattern)) {
          error = "Weak password";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        formErrors[key] = error;
      }
    });

    setErrors(formErrors);
    console.log("Validation errors:", formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // login(data.token);
        navigate("/login");
      } else {
        setFormError(data.message || "An error occurred");
      }
    } catch (error) {
      setFormError("Server error");
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-header">
          <h2>QUIZZIE</h2>
          <div className="toggle-buttons">
            <button className="active">Sign Up</button>
            <button onClick={handleRedirect}>Log In</button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="from-contianer">
            <div className="form-fields-title">
              <h1>Name</h1>
              <h1>Email</h1>
              <h1>Password</h1>
              <h1>Confirm Password</h1>
            </div>
            <div className="form-fields-input">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
                placeholder={errors.name || ""}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                placeholder={errors.email || ""}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <span className="password-error">
                {errors.password ? errors.password : ""}
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <span className="confirm-password-error">
                {errors.confirmPassword ? errors.confirmPassword : ""}
              </span>
            </div>
          </div>
          <div>
            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
