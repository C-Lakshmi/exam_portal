import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Results.css";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const Analysis = () => {
  const location = useLocation();
  const { examId } = location.state || {};
  console.log(examId)

  // State for fetched data
  const [analysis, setAnalysis] = useState({
    strengths: [],
    weaknesses: [],
    questionAccuracy: [],
    difficultyDistribution: [],
    timeSpent: [],
  });

  // Colors for Pie Charts
  const COLORS = ["#4caf50", "#f44336"]; // Green for correct, red for incorrect
  const DIFFICULTY_COLORS = ["#81c784", "#ffb74d", "#e57373"]; // Easy, Medium, Hard

 
  const fetchAnalysis = async () => {
    try {
      const response = await axios.post("/api/student/analysis", {examId} );
      const data = response.data;
      console.log("Analysis fetched:", data);
      // Convert time strings to seconds
    
      setAnalysis({
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        questionAccuracy: data.accuracyData || [],
        difficultyDistribution: data.difficultyData || [],
        timeSpent: data.timeSpentData,
      });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  };
  useEffect(() => {
    if (examId) {
      fetchAnalysis();
      console.log(analysis.timeSpent)
      //console.log(analysis)
    }
  }, [examId]);
  
 // console.log(analysis)
  return (
    <div>
      <Navbar />
      <div className="analysis-container">
        <h2 className="analysis-title">Exam Analysis</h2>

        {/* Strengths and Weaknesses */}
        <div className="analysis-card">
          <h3>Strengths and Weaknesses</h3>
          <div className="analysis-strengths">
            <strong>Strengths:</strong>
            <ul>
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="analysis-weaknesses">
            <strong>Weaknesses:</strong>
            <ul>
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question Accuracy - Pie Chart */}
        <div className="analysis-card">
          <h3>Question Accuracy</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={analysis.questionAccuracy}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {analysis.questionAccuracy.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div className="legend">
            <p>
              <span style={{ color: "#4caf50", fontWeight: "bold" }}>●</span> Correct
            </p>
            <p>
              <span style={{ color: "#f44336", fontWeight: "bold" }}>●</span> Incorrect
            </p>
          </div>
        </div>

        {/* Difficulty Distribution - Pie Chart */}
        <div className="analysis-card">
          <h3>Difficulty Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={analysis.difficultyDistribution}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {analysis.difficultyDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <div className="legend">
            <p>
              <span style={{ color: "#81c784", fontWeight: "bold" }}>●</span> Easy
            </p>
            <p>
              <span style={{ color: "#ffb74d", fontWeight: "bold" }}>●</span> Medium
            </p>
            <p>
              <span style={{ color: "#e57373", fontWeight: "bold" }}>●</span> Hard
            </p>
          </div>
        </div>

        {/* Time Spent on Each Question - Bar Chart */}
        <div className="analysis-card">
          <h3>Time Spent on Each Question</h3>
          <BarChart
            width={500}
            height={300}
            data={analysis.timeSpent}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="time" fill="#1976d2" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
