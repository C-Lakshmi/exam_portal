import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/api/student/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  const handleBook = async (exam_id, fees, e) => {
    try {
      const response = await axios.post("/api/student/fees", { exam_id, fees });
      const val = response.data;
      if (val === "paid") {
        alert("Booked successfully!");
        e.target.innerHTML = "Booked";
      } else if (val === "Already paid") {
        alert("You have already booked this exam!");
        e.target.innerHTML = "Booked";
      }
    } catch (error) {
      console.error("Error booking exam:", error);
    }
  };

  const handleRequest = (exam_id) => {
    navigate("/student/reschedule");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
      <h1 className="text-center text-3xl font-semibold text-black mt-2 ">
        Student Dashboard
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-center">Exam ID</th>
              <th className="px-6 py-3 text-center">Exam Name</th>
              <th className="px-6 py-3 text-center">Department</th>
              <th className="px-6 py-3 text-center">Slot</th>
              <th className="px-6 py-3 text-center">Fees</th>
              <th className="px-6 py-3 text-center">Duration</th>
              <th className="px-6 py-3 text-center">Pay Fees</th>
              <th className="px-6 py-3 text-center">Reschedule</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.exam_id} className="border-b hover:bg-gray-100">
                <td className="py-3">{exam.exam_id}</td>
                <td className="py-3">{exam.exam_name}</td>
                <td className=" py-3">{exam.dept}</td>
                <td className="py-3">{new Date(exam.slot).toLocaleString()}</td>
                <td className="py-3">{exam.fees}</td>
                <td className=" py-3">{exam.duration} mins</td>
                <td className=" py-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    onClick={(e) => handleBook(exam.exam_id, exam.fees, e)}
                  >
                    Book
                  </button>
                </td>
                <td className="px-6 py-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => handleRequest(exam.exam_id)}
                  >
                    Reschedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
