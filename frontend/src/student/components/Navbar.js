import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center w-full">
      <h1 className="text-2xl font-semibold text-white pl-2">Exam Portal</h1>
      <div className="flex items-center space-x-6 ">
        <Link
          to="/student/exams"
          className="text-lg p-2 rounded-md font-medium hover:text-black hover:bg-white transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          to="/student/portal"
          className="text-lg p-2 rounded-md font-medium hover:text-black hover:bg-white transition-colors duration-300"
        >
          My Exams
        </Link>
        <Link
          to="/student/results"
          className="text-lg p-2 rounded-md font-medium hover:text-black hover:bg-white transition-colors duration-300"
        >
          Results
        </Link>
        
        {/* Account Icon */}
        <Link to="/logout">
          <img
            src="/account.png" // Use your own image URL here
            alt="Account"
            className="rounded-full w-10 h-10 hover:opacity-80 transition-opacity duration-300 mr-6"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;




