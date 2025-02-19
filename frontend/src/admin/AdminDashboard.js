import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.post("/api/admin/dashboard");
        setExams(res.data);
      } catch (err) {
        console.error("Failed to fetch exams.");
      }
    };
    fetchExams();
  }, []);

  const handleRequest = (id, name) => {
    navigate("/admin/request", { state: { examId: id, name: name } });
  };

  const handleAdd = () => {
    navigate("/admin/add");
  };

  const handleAnalysis = (id, name) => {
    navigate("/admin/analysis", {state: { examId: id, name: name }});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#2364AA] mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 text-center mb-6">Manage exams, students, and schedules here.</p>
        <hr className="border-t-2 border-blue-500 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#2364AA] text-white">
                <th className="p-3 text-center">Exam ID</th>
                <th className="p-3 text-center">Exam Name</th>
                <th className="p-3 text-center">Department</th>
                <th className="p-3 text-center">Slot</th>
                <th className="p-3 text-center">Fees</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center">Reschedule</th>
                <th className="p-3 text-center">Analysis</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.exam_id} className="odd:bg-gray-100 even:bg-white">
                  <td className="p-3">{exam.exam_id}</td>
                  <td className="p-3">{exam.exam_name}</td>
                  <td className="p-3">{exam.dept}</td>
                  <td className="p-3">{new Date(exam.slot).toLocaleString()}</td>
                  <td className="p-3">{exam.fees}</td>
                  <td className="p-3">{exam.duration} mins</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRequest(exam.exam_id, exam.exam_name)}
                      className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-500 transition"
                    >
                      Reschedule
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleAnalysis(exam.exam_id, exam.exam_name)}
                      className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-500 transition"
                    >
                      Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleAdd}
            className="bg-[#2364AA] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
