import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reschedule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    exam_id: "",
    new_slot: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendData = async () => {
    try {
      const done = await axios.post("/student/reschedule", formData);
      console.log(done.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendData();
    alert("Form submitted successfully!");
    navigate("/student/exams");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Reschedule Exam</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exam_id" className="block text-sm font-medium text-gray-700">Exam ID:</label>
            <input
              type="number"
              id="exam_id"
              name="exam_id"
              value={formData.exam_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new_slot" className="block text-sm font-medium text-gray-700">New Slot:</label>
            <input
              type="datetime-local"
              id="new_slot"
              name="new_slot"
              value={formData.new_slot}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reschedule;

