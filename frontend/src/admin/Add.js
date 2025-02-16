import React, { useState } from "react";
import "./admin.css"; // Import CSS file for styling
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Add = () => {
    const navigate =useNavigate();
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
  const func= async()=>{
    try{
        const ans=await axios.post("/api/admin/add", formData)
        navigate("/admin/dashboard");
        //console.log(ans.data);
    } catch(err){
        //console.log(err);
    }
    };
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Form submitted:", formData);
    // Add logic to handle form submission
    func();
  };

  return (
    <div className="form-container">
      <h2>Add Exam Details</h2>
      <form onSubmit={handleSubmit}>
        <label>Exam ID:</label>
        <input type="text" name="exam_id" value={formData.exam_id} onChange={handleChange} required />

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Department:</label>
        <input type="text" name="dept" value={formData.dept} onChange={handleChange} required />

        <label>Slot:</label>
        <input type="text" name="slot" value={formData.slot} onChange={handleChange} required />

        <label>Fees:</label>
        <input type="number" name="fees" value={formData.fees} onChange={handleChange} required />

        <label>Duration (mins):</label>
        <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />

        <button type="submit" className="form_Add">Submit</button>
      </form>
    </div>
  );
};

export default Add;