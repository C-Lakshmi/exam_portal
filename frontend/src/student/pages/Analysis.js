import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import ExamReview from "../components/ExamReview"
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
    Rank: 0,
    Percentile: 0,
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
        timeSpent: response.data.timeSpentData,
        Rank: response.data.Rank,
        Percentile: response.data.Percentile,
      });
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  };

  useEffect(() => {
    if (examId) { fetchAnalysis(); }
  }, [examId]);

  return (
    <div className="relative min-h-screen bg-cover bg-no-repeat"
    style={{ backgroundImage: `url('/analysis.jpg')` }}>
      <Navbar />
      <div className=" bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-200 min-h-screen">
        <div className="max-w-6xl mx-auto py-12 px-6">
          {/* Header */}
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-8">Your Exam Analysis</h2>

          {/* Rank and Percentile Section */}
          <div className="bg-white shadow-xl rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h3 className="text-xl font-semibold text-indigo-700">Rank</h3>
              <p className="text-2xl font-bold text-indigo-800">{analysis.Rank}</p>
            </div>
            <div className="text-center sm:text-right">
              <h3 className="text-xl font-semibold text-indigo-700">Percentile</h3>
              <p className="text-2xl font-bold text-indigo-800">{analysis.Percentile}%</p>
            </div>
          </div>

          {/* Strengths and Weaknesses Section */}
          <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Strengths and Weaknesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg shadow-md">
                <strong className="text-green-700 text-lg">Strengths:</strong>
                <ul className="list-disc list-inside text-gray-700">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg shadow-md">
                <strong className="text-red-700 text-lg">Weaknesses:</strong>
                <ul className="list-disc list-inside text-gray-700">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Question Accuracy and Difficulty Distribution Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">Question Accuracy</h3>
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

            <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">Difficulty Distribution</h3>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={DIFFICULTY_COLORS[index % DIFFICULTY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          {/* Time Spent on Questions Section */}
          <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-semibold text-center text-indigo-700 mb-6">Time Spent on Each Question</h3>
            <div className="flex justify-center">
              <BarChart
                width={600}
                height={350}
                data={analysis.timeSpent}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
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
        <ExamReview examId= {examId}/>
      </div>
    </div>
  );
};

export default Analysis;

