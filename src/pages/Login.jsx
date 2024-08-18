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

    if (isLogin) {
      console.log("Logging in:", formData);
      login();
      navigate("/dashboard");
    } else {
      console.log("Signing up:", formData);
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-header">
          <h2>QUIZZIE</h2>
          <div className="toggle-buttons">
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="from-contianer">
            <div className="form-fields-title">
              {!isLogin && <h1>Name</h1>}
              <h1>Email</h1>
              <h1>Password</h1>
              {!isLogin && <h1>Confirm Password</h1>}
            </div>
            <div className="form-fields-input">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                  placeholder={errors.name ? errors.name : "Name"}
                />
              )}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                placeholder={errors.email ? errors.email : "Email"}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                placeholder={errors.password ? errors.password : "Password"}
              />
              {!isLogin && (
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "input-error" : ""}
                  placeholder={
                    errors.confirmPassword
                      ? errors.confirmPassword
                      : "Confirm Password"
                  }
                />
              )}
            </div>
          </div>
          <div>
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
