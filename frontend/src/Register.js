import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        navigate("/student/login");
      }
      
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }
  };
    return (
      <div
        className="relative min-h-screen bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/register.jpg')" }}
      >
         {/* Diagonal Text */}
         <div className="absolute top-[70px] right-[100px] tranform -rotate-[1deg] text-[80px] font-bold font-greatVibes ">
        Examinations Conquered
        </div>
        <div className="absolute top-[170px] right-[60px] text-[60px] tranform -rotate-[1deg] font-semibold font-lavishlyYours">
          join us to push boundaries and learn better
        </div>
        {/* Register Form */}
        <div className="flex justify-end items-center min-h-screen">
          <div className="bg-white px-8 rounded-3xl shadow-xl w-120 h-[330px] mt-4 mr-32">
            <h1 className="font-semibold text-[45px] text-center mb-6 text-black font-greatVibes">Register</h1>
            <form onSubmit={handleRegister} className="space-y-4">
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
                Register
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
          </div>
          </div>
      </div>
    );
  };
  
export default Register;
  

