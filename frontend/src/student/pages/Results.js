import React from "react";
import { useNavigate } from "react-router-dom";
import "./Results.css"
import Navbar from "../components/Navbar"
import axios from "axios";
import { useState,useEffect } from "react";

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post("/api/student/results");
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  const handleExamClick = (id) => {
    navigate("/student/analysis", { state: { examId: id } });
  };
  

  return (
    <div>
      <Navbar/>
      <div className="results-container">
      <h2 className="results-title">Results</h2>
      {results.map((exam) => (
        <div
          key={exam.id}
          className="result-card"
          onClick={() => handleExamClick(exam.exam_id)}
        >
          <div className="result-name">{exam.exam_name}</div>
          <div className="result-score">{exam.score} / {exam.total_qs}</div>
        </div>
      ))}
      {results.length === 0 && (
        <p className="no-results">No results available yet.</p>
      )}
    </div>
    </div>
  );
};

export default Results;

