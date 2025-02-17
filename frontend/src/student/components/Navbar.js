import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center w-full">
      <h1 className="text-2xl font-semibold text-white">Exam Portal</h1>
      <div className="flex space-x-6">
        <Link to="/student/exams" className="hover:underline">Home</Link>
        <Link to="/student/portal" className="hover:underline">My Exams</Link>
        <Link to="/student/results" className="hover:underline">Results</Link>
      </div>
    </nav>
  );
};

export default Navbar;



