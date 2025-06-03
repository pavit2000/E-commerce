import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust the path if needed

function LoginButton() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return null; // don't show anything if user is logged in

  return (
    <button className="login-btn" onClick={() => navigate("/login")}>
      Login
    </button>
  );
}

export default LoginButton;
