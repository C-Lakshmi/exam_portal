import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";


const AdminAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId, name } = location.state;
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.post("/api/admin/analysis", { exam_id: examId });
        console.log(response.data.avgtime)
        setAnalysis(response.data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [examId]);

  if (loading) return <div className="text-center text-xl font-semibold mt-10">Loading...</div>;
  if (!analysis) return <div className="text-center text-xl font-semibold mt-10">No Data Available</div>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const accuracyColors = ["#28a745", "#dc3545"];

  return (
    <div className="container mx-auto p-6">
        {/* Average Score & Average Time */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold">Exam Statistics</h2>
        <p className="text-lg mt-2"><strong>Average Score:</strong> {analysis.avgscore}</p>
        <p className="text-lg"><strong>Average Time taken for Exam:</strong> {analysis.avgtime} seconds</p>
      </div>
      {/* Student Scores Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Student Scores</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Student ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {analysis.scoreTable.map((student) => (
                <tr key={student.stud_id} className="text-center">
                  <td className="border p-2">{student.stud_id}</td>
                  <td className="border p-2">{student.stud_name}</td>
                  <td className="border p-2 font-bold">{student.score}/{student.total_qs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Time Per Question Bar Chart */}
        <div className="bg-white shadow-lg p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Avg Time Spent Per Question</h2>
          <BarChart width={500} height={300} data={analysis.timeSpentData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="question" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="time" fill="#1976d2" />
          </BarChart>
        </div>

        {/* Difficulty Distribution Pie Chart */}
        <div className="bg-white shadow-lg p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Difficulty Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie data={analysis.difficultyData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={120} fill="#8884d8" dataKey="value">
              {analysis.difficultyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-green-700">Top Strengths</h2>
          {analysis.strengths.length > 0 ? (
            <ul className="list-disc ml-6">
              {analysis.strengths.map((topic, index) => (
                <li key={index} className="text-green-800 font-semibold">{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No strengths identified.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-red-700">Top Weaknesses</h2>
          {analysis.weaknesses.length > 0 ? (
            <ul className="list-disc ml-6">
              {analysis.weaknesses.map((topic, index) => (
                <li key={index} className="text-red-800 font-semibold">{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No weaknesses identified.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalysis;
