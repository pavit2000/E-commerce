import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust the path as needed

function RegisterButton() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return null; // don't show if user is logged in

  return (
    <button className="register-btn" onClick={() => navigate("/register")}>
      Register
    </button>
  );
}

export default RegisterButton;
