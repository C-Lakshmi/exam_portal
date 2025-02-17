import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/student/login", { Name, email, phone, username, password });
      navigate("/student/exams");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/register.jpg')" }} // Use a background image specific for login page
    >
      {/* Diagonal Text */}
      <div className="absolute top-[30px] right-[180px] transform -rotate-[1deg] text-[80px] font-bold font-greatVibes">
        Welcome Back
      </div>
      <div className="absolute top-[130px] right-[160px] text-[60px] transform -rotate-[1deg] font-semibold font-lavishlyYours">
        Please login to your account
      </div>

      {/* Login Form */}
      <div className="flex justify-end items-center min-h-screen">
        <div className="bg-white px-8 rounded-3xl shadow-xl w-[500px] h-[500px] mt-24 mr-36">
          <h1 className="font-semibold text-[40px] text-center mb-4 text-black font-greatVibes">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black "
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black "
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black "
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-1 rounded-lg hover:bg-[#2A3F54] transition font-lavishlyYours text-[30px]"
            >
              Login
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;


