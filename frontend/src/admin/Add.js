import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    exam_id: "",
    name: "",
    dept: "",
    slot: "",
    fees: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const func = async () => {
    try {
      await axios.post("/api/admin/add", formData);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    func();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Exam Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Exam ID:</label>
            <input
              type="text"
              name="exam_id"
              value={formData.exam_id}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Department:</label>
            <input
              type="text"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Slot:</label>
            <input
              type="text"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Fees:</label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Duration (mins):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
