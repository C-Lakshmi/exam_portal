import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Dashboard.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Fetch exams data from API when the component is mounted
    const fetchExams = async () => {
      try {
        const response = await axios.get("/api/student/exams");
        console.log(response.data)
        setExams(response.data); // Update state with fetched exams
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

const handleBook = async (exam_id, fees, e)=> {
  try {
  const response = await axios.post("/api/student/fees", {exam_id, fees});
  const val=response.data;
  if(val === "paid") {
    alert("Booked successfully!")
    e.target.innerHTML="Booked";
  }
  else if(val === "Already paid"){
    alert("You have already booked this exam!")
    e.target.innerHTML="Booked";
  }
    
  } catch (error) {
    console.error("Error fetching exams:", error);
  }
};
const handleRequest= async (exam_id,e) => {
navigate("/student/reschedule")
};
  return (
    
    <div>
    
      <div><Navbar /></div>
      <h1 style={{textAlign: "center", color: "darkcyan"}}>Student Dashboard</h1>
      <table className="dashboard-table">
  <thead>
    <tr>
      <th>Exam ID</th>
      <th>Exam Name</th>
      <th>Department</th>
      <th>Slot</th>
      <th>Fees</th>
      <th>Duration</th>
      <th>Pay Fees</th>
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
        <td>
          <button className="book-btn" onClick={(e) => handleBook(exam.exam_id, exam.fees, e)}  > Book </button>
        </td>
        <td><button className="book-btn" onClick={(e) => handleRequest(exam.exam_id, e)}> Reschedule </button></td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Dashboard;
