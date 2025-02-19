import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const history = useHistory();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        
        await axios.post("/api/logout");
        
        navigate("/student/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
    logoutUser();
  }, [history]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg">Logging out...</p>
    </div>
  );
};

export default Logout;
