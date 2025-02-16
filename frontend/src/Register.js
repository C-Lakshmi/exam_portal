import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", { username, password });
      const val = response.data;
      
      if (val === "Admin") {
        navigate("/admin/dashboard");
      } else if (val === "Student") {
        navigate("/student/login");
      } else if (val === "Student exists") {
        navigate("student/login")
      }
      
    } catch (err) {
        console.log(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;
