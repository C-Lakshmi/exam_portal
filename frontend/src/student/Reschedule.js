import React, { useState } from "react";
import "./reschedule.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Reschedule = () => {
    const navigate =useNavigate();
  const [formData, setFormData] = useState({
    exam_id : "",
    new_slot: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const sendData= async()=>{
  try{
  const done= axios.post("./student/reschedule",{formData});
  console.log(done.data);
  }catch(err){
    console.log(err);
  }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");

    navigate("/student/exams");
  };

  return (
    <div className="reschedule-form-container">
      <form className="reschedule-form" onSubmit={handleSubmit}>
        <h2>Reschedule Form</h2>
        <div className="form-group">
        <label htmlFor="exam_id">Exam_id:</label>
        <input type="number" id="exam_id" name="exam_id" 
        value={formData.exam_id}
        onChange={handleChange}
        required/>
          <label htmlFor="new_slot">New Slot:</label>
          <input
            type="datetime-local"
            id="new_slot"
            name="new_slot"
            value={formData.new_slot}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default Reschedule;
