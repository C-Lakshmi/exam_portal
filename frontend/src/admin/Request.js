import React, { useState } from "react";
import "./admin.css"; // Import CSS file for styling
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { useLocation } from "react-router-dom";

const Request = () => {
    const navigate =useNavigate();
    const [req,setReq]=useState([]);
    const location = useLocation();
    const { examId, name } = location.state;
 const getReq= async()=>{
    try{
        const ans=await axios.post("/api/admin/request", {examId})
        setReq(ans.data);
        //console.log(ans.data);
    } catch(err){
        console.log(err);
    }
 };

   const approvefunc= async(req_id,new_slot)=>{
    try{
        const ans=await axios.post("/api/admin/approve", {req_id,examId,new_slot})
        navigate("/admin/dashboard");
        //console.log(ans.data);
    } catch(err){
        //console.log(err);
    }
    };
  const approve = (req_id,new_slot) => {
    approvefunc(req_id,new_slot);
  };
  const rejfunc= async(req_id,new_slot)=>{
    try{
        const ans=await axios.post("/api/admin/reject", {req_id,examId,new_slot})
        navigate("/admin/dashboard");
        //console.log(ans.data);
    } catch(err){
        //console.log(err);
    }
    };
  const reject=(req_id,new_slot)=>{
    rejfunc(req_id,new_slot);
    };
    getReq(examId);

  return (
    <div>
      <h1>{name} Reschedule Requests</h1>
      <div className="admin_content">Manage schedules here.</div>
      <hr style={{height:"1px",background:"darkblue"}}></hr>
      <table className="dashboard-table">
  <thead>
    <tr>
      <th>Student ID</th>
      <th>New_slot</th>
      <th>Approve</th>
      <th>Reject</th>
    </tr>
  </thead>
  <tbody>
    {req.map((r) => (
      <tr key={r.request_id}>
        <td>{r.stud_id}</td>
        <td>{new Date(r.new_slot).toLocaleString()}</td>
        <td><button className="decide" onClick={() => approve(r.req_id, r.new_slot)}> Approve </button></td>
        <td><button className="decide" onClick={() => reject(r.req_id, r.new_slot)}> Reject </button></td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default Request;