import React from "react";
import "./admin.css"
import { useState } from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom"
const AdminDashboard = () => {
  const [exams,setExams]=useState([]);
  const navigate =useNavigate();
  const fetchExams= async ()=>{
  try{
    const res= await axios.post("/api/admin/dashboard");
    setExams(res.data);
  }catch(err){
    console.log("Failed to fetch.")
  }
  };
  fetchExams();
  //console.log(exams);
const handleRequest= async (id,name)=> {
    navigate("/admin/request",{ state: { examId: id, name: name } });
    };
const handleAdd = async() =>{
  navigate("/admin/add");
};
  return (
    <div className="adminDashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin_content">Manage exams, students, and schedules here.</div>
      <hr style={{height:"1px",background:"darkblue"}}></hr>
      <table className="dashboard-table">
  <thead>
    <tr>
      <th>Exam ID</th>
      <th>Exam Name</th>
      <th>Department</th>
      <th>Slot</th>
      <th>Fees</th>
      <th>Duration</th>
      <th>Reschedule</th>
    </tr>
  </thead>
  <tbody>
    {exams.map((exam) => (
      <tr key={exam.exam_id}>
        <td>{exam.exam_id}</td>
        <td>{exam.exam_name}</td>
        <td>{exam.dept}</td>
        <td>{new Date(exam.slot).toLocaleString()}</td>
        <td>{exam.fees}</td>
        <td>{exam.duration} mins</td>
        <td><button className="book-btn" onClick={(e) => handleRequest(exam.exam_id,exam.exam_name)}> Reschedule </button></td>
      </tr>
    ))}
  </tbody>
</table>
<button className="add_btn" onClick={handleAdd}>Add Exam</button>
    </div>
  );
};

export default AdminDashboard;
