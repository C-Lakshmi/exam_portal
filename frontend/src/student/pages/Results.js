import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

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
       <Navbar />
       <div className="flex">
      {/* Background Image Section */}
      <div
        className="relative min-h-screen bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('/result.jpg')`,
          width: "2000px",  // Or use 100% for a responsive layout
          height: "100vh", // Adjust height if needed
          marginLeft: "-150px"
        }}
      >
        {/* Navbar */}
       
      </div>
  
      {/* Main Content Section */}
      <div className="flex min-h-screen w-[600px]">
        <div className="right-side-panel">
          <div className="exam-portal p-6">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Results</h2>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md border border-blue-200 hover:shadow-lg hover:bg-blue-100 transition-transform transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleExamClick(exam.exam_id)}
                  >
                    <div className="text-lg font-semibold text-blue-900">{exam.exam_name}</div>
                    <div className="text-lg font-semibold text-teal-700">
                      {exam.score} / {exam.total_qs}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 text-lg mt-6">No results available yet.</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );  
};

export default Results;