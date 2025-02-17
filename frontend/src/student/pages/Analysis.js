import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
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

  const [analysis, setAnalysis] = useState({
    strengths: [],
    weaknesses: [],
    questionAccuracy: [],
    difficultyDistribution: [],
    timeSpent: [],
  });

  const COLORS = ["#4caf50", "#f44336"];
  const DIFFICULTY_COLORS = ["#81c784", "#ffb74d", "#e57373"];

  const fetchAnalysis = async () => {
    try {
      const response = await axios.post("/api/student/analysis", { examId });
      setAnalysis({
        strengths: response.data.strengths || [],
        weaknesses: response.data.weaknesses || [],
        questionAccuracy: response.data.accuracyData || [],
        difficultyDistribution: response.data.difficultyData || [],
        timeSpent: response.data.timeSpentData || [],
      });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  };

  useEffect(() => {
    if (examId) fetchAnalysis();
  }, [examId]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Exam Analysis</h2>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">Strengths and Weaknesses</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-green-600">Strengths:</strong>
              <ul className="list-disc list-inside text-gray-700">
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-red-600">Weaknesses:</strong>
              <ul className="list-disc list-inside text-gray-700">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Question Accuracy</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={analysis.questionAccuracy}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {analysis.questionAccuracy.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-2">Difficulty Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={analysis.difficultyDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {analysis.difficultyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-2 text-center">Time Spent on Each Question</h3>
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
