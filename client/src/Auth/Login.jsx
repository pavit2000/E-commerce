import React, { useState, useEffect } from "react";
import "../CSS/Auth.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRedirectIfLoggedIn } from "../hooks/useRedirectIfLoggedIn";
const BASE_URL = "http://localhost:5001";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useRedirectIfLoggedIn(user);

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        const error =
          typeof result === "string"
            ? result
            : result.message || `${response.status} ${response.statusText}`;
        throw new Error(error);
      }

      // Saving user info and token to localStorage
      login(result);

      navigate("/");
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password:
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
