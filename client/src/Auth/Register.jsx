import React, { useState } from "react";
import "../CSS/Auth.css"; 
import { useNavigate } from "react-router-dom";
const BASE_URL = "http://localhost:5001";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
    });
    
    const[message, setMessage] = useState("null");
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            console.log("Response:", response);
            const result = await response.json();
            if (!response.ok) {
                const error = typeof result === "string" ? result : result.message || `${response.status} ${response.statusText}`;
                throw new Error(error);
            }
            navigate("/login");
            setMessage("Registration successful! Please login.");
        }
        catch (error) {
            setMessage(error.message);
        }
    };
        return (
            <div className="form-container">
            <h2>Register</h2>
            {message && <p className="form-message">{message}</p>}
            <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input name="username" type="text" value={formData.username} onChange={handleChange} required />
            </label>
    
            <label>
                Email:
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </label>
    
            <label>
                Password:
                <input name="password" type="password" value={formData.password} onChange={handleChange} required />
            </label>
    
            <label>
                Admin:
                <input name="isAdmin" type="checkbox" checked={formData.isAdmin} onChange={handleChange} />
            </label>
    
            <button type="submit">Register</button>

            <p>Already have an account?</p>
            <button type="button" onClick={() => navigate("/login")}>
                Login
            </button>
            </form>
            </div>
        );
};

export default Register;