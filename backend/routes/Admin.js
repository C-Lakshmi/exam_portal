const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// Fetch student details entered in registration page and insert into DB:
router.post("/dashboard", async (req, res) => {
const q= "SELECT exam_id, exam_name, dept, slot, fees, duration FROM exams";
try {
    const response= await new Promise((resolve,reject)=>{
        db.query(q,(err,results)=>{
            if (err) {
                reject(err); // Pass the error to the catch block
              } else {
                resolve(results);
        }});
});
res.json(response);
} catch(err){
    console.log(err);
}
});

router.post("/add", async (req, res) => {
    console.log(req.body);
    const { exam_id, name, dept, slot, fees, duration } = req.body;
    const q = "INSERT into exams(exam_id, exam_name, dept, slot, fees, duration) VALUES (?,?,?,?,?,?)";
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(q, [exam_id, name, dept, slot, fees, duration], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        console.log(response);
        res.json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Fetch reschedule requests for a specific exam
router.post("/request", async (req, res) => {
    //console.log(req.body);
    const { examId } = req.body;
    const q1 = "SELECT request_id, stud_id, new_slot FROM reschedule_requests WHERE exam_id = ?";
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(q1, [examId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json(response);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Approve a reschedule request and update exam slot
router.post("/approve", async (req, res) => {
    console.log(req.body);
    const { req_id, examId, new_slot } = req.body;
    try {
        const q1 = "UPDATE reschedule_requests SET request_status = 'Approved' WHERE request_id = ?";
        const q2 = "UPDATE exams SET slot = ? WHERE exam_id = ?";
        
        await new Promise((resolve, reject) => {
            db.query(q1, [req_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        await new Promise((resolve, reject) => {
            db.query(q2, [new_slot, examId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json({ message: "Request approved and exam slot updated" });
    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Reject a reschedule request
router.post("/reject", async (req, res) => {
    console.log(req.body);
    const { req_id } = req.body;
    const q1 = "UPDATE reschedule_requests SET request_status = 'Rejected' WHERE request_id = ?";
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(q1, [req_id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        res.json({ message: "Request rejected" });
    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
