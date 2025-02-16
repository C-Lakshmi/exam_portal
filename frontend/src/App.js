import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./student/Login";
import AdminDashboard from "./admin/AdminDashboard";
import Result from "./student/pages/Results";
import Register from "./Register";
import Dashboard from "./student/components/Dashboard";
import Reschedule from "./student/Reschedule";
import Portal from "./student/Portal"
import Analysis from "./student/pages/Analysis"
import Add from "./admin/Add"
import Request from "./admin/Request"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Register />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/student/login" element={<Login />} />
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/add"
          element={<Add />}
        />
        <Route
          path="/admin/request"
          element={<Request />}
        />

        {/* Student Routes */}
         
          <Route path="/student/exams" element={<Dashboard />} />
          <Route path="/student/fees" element={<Dashboard />} />
          <Route path="/student/portal" element={<Portal />} />
          <Route path="/student/upcoming" element={<Portal/>} />
          <Route path="/student/question" element={<Portal/>} />
          <Route path="/student/submit" element={<Result />} />
          <Route path="/student/results" element={<Result />} />
          <Route path="/student/analysis" element={<Analysis />} />
          <Route path="/student/reschedule" element={< Reschedule/>} />
      </Routes>
    </Router>
  );
};

export default App;
