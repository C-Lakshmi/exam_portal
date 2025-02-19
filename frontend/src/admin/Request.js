import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Request = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examId, name } = location.state;
  const [req, setReq] = useState([]);

  useEffect(() => {
    const getReq = async () => {
      try {
        const ans = await axios.post("/api/admin/request", { examId });
        setReq(ans.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    getReq();
  }, [examId]);

  const handleDecision = async (req_id, new_slot, decision) => {
    const endpoint = decision === "approve" ? "/api/admin/approve" : "/api/admin/reject";
    try {
      await axios.post(endpoint, { req_id, examId, new_slot });
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(`Error ${decision}ing request:`, err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">
          {name} Reschedule Requests
        </h1>
        <p className="text-gray-700 font-2xl font-bold text-center mb-6">Manage exam schedules here</p>
        <hr className="border-t-2 border-blue-500 mb-6" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">New Slot</th>
                <th className="p-3 text-center">Approve</th>
                <th className="p-3 text-center">Reject</th>
              </tr>
            </thead>
            <tbody>
              {req.length > 0 ? (
                req.map((r) => (
                  <tr key={r.request_id} className="odd:bg-gray-100 even:bg-white">
                    <td className="p-3">{r.stud_id}</td>
                    <td className="p-3">{new Date(r.new_slot).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDecision(r.request_id, r.new_slot, "approve")}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDecision(r.request_id, r.new_slot, "reject")}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No reschedule requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Request;
