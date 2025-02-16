import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Exam Portal</h1>
      <div className="navbar-links">
        <Link to="/student/exams">Home</Link>
        <Link to="/student/portal">My Exams</Link>
        <Link to="/student/results">Results</Link>
      </div>
    </nav>
  );
};

export default Navbar;


