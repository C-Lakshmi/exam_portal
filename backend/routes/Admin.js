const express = require("express");
const moment = require('moment-timezone');
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
    const q1 = "SELECT request_id, stud_id, new_slot FROM reschedule_requests WHERE exam_id = ? AND request_status='Pending'";
    try {
        const response = await new Promise((resolve, reject) => {
            db.query(q1, [examId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        //console.log(response);
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
    const localTime = moment.utc(new_slot).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

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
            db.query(q2, [localTime, examId], (err, results) => {
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

router.post("/analysis", async (req, res) => {
    console.log(req.body);
    const { exam_id } = req.body;
    const scoreQ = "SELECT dashboard.stud_id, stud_name, dashboard.score, total_qs FROM dashboard JOIN students WHERE dashboard.stud_id = students.stud_id AND dashboard.exam_id = ? ORDER BY dashboard.score DESC;"
    const avgScoreQ ="SELECT AVG(score) AS avg_score FROM dashboard WHERE dashboard.exam_id = ?;"
    const timeQ = `SELECT ques_id, AVG(time_spent) AS time_spent FROM exam_portal WHERE exam_id = ? GROUP BY ques_id;`
    const avgTimeQ = `SELECT AVG(time_spent) AS avg_time_spent FROM exam_portal WHERE exam_id = ? `
    const difficultyQ = `
    SELECT difficulty, COUNT(*) AS count
    FROM questions
    WHERE exam_id = ?
    GROUP BY difficulty;
  `;
   const topicQ = `
    SELECT topic, 
    COUNT(CASE WHEN given_ans = solved.ans THEN 1 END) AS correct_count,
    COUNT(*) AS total_count
    FROM solved
    INNER JOIN questions ON solved.ques_id = questions.ques_id
    WHERE solved.exam_id= ?
    GROUP BY topic
    ORDER BY COUNT(CASE WHEN given_ans = solved.ans THEN 1 END) / COUNT(*) DESC;
    `;
    try {
        const [scores, avgScore, time, avgTime, difficulty, topic] =
            await Promise.all([
            new Promise((resolve, reject) =>
                db.query(scoreQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            ),
            new Promise((resolve, reject) =>
                db.query(avgScoreQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            ),
            new Promise((resolve, reject) =>
                db.query(timeQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            ),new Promise((resolve, reject) =>
                db.query(avgTimeQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            ),
            new Promise((resolve, reject) =>
                db.query(difficultyQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            ),
            new Promise((resolve, reject) =>
                db.query(topicQ, [exam_id], (err, results) =>
                err ? reject(err) : resolve(results)
                )
            )
        ]);
      //console.log(scores[0]);
      const scoreTable = scores;
      
      //console.log(time);
      let timeSpentData = time.map(({ ques_id, time_spent }) => ({
        question: `Q${ques_id}`,
        time: time_spent,
      }));
      //console.log(difficulty)
      const difficultyData = difficulty.map(({ difficulty, count }) => ({
        name: difficulty,
        value: count,
      }));
      console.log(topic)
      const strengths = topic
        .slice(0, 2)
        .map(({ topic }) => topic);
      const weaknesses = topic
        .slice(-2)
        .map(({ topic }) => topic);

        const avgscore = avgScore[0].avg_score
        const avgtime = avgTime[0].avg_time_spent
        console.log(scores[0])
        const accuracyData = [
            { name: "Correct", value: avgscore },
            { name: "Incorrect", value: scores[0].total_qs - avgscore },
          ];
        console.log({
            scoreTable,
            accuracyData,
            timeSpentData,
            difficultyData,
            strengths,
            weaknesses,
            avgscore,
            avgtime,
          })
        res.json({
            scoreTable,
            accuracyData,
            timeSpentData,
            difficultyData,
            strengths,
            weaknesses,
            avgscore,
            avgtime,
          });
        } catch (error) {
            console.error("Error fetching analysis:", error);
            res.status(500).json({ error: "Failed to fetch analysis" });
          }
});

module.exports = router;
