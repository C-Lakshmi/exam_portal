const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const session = require("express-session");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Wrapper function to handle async errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.use(
    session({
      secret: "your_secret_key", // Replace with a secure key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }, // Set `secure: true` if using HTTPS
    })
  );

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { Name, email, phone, username, password } = req.body;

    try {
      // Check if the username exists in the user_registration table
      const userQuery = `SELECT * FROM user_registration WHERE username = ?`;
      const user = await new Promise((resolve, reject) => {
        db.query(userQuery, [username], (err, results) => {
          if (err) {
            console.error("Database error while checking user:", err);
            reject(err);
          } else {
            //console.log(results[0]);
            resolve(results[0]); // Resolve with the first matching user
          }
        });
      });

      // If no user is found
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // Check if Name already exists in the students table
      const studentCheckQuery = `SELECT * FROM students WHERE stud_name = ?`;
      const existingStudent = await new Promise((resolve, reject) => {
        db.query(studentCheckQuery, [Name], (err, results) => {
          if (err) {
            console.error("Database error while checking student name:", err);
            reject(err);
          } else {
            resolve(results[0]); // Resolve with the first matching student
          }
        });
      });

      let stud_id;
      if (existingStudent) {
        // If student already exists, get the `stud_id`
        stud_id = existingStudent.stud_id;
      } else {
        // If student doesn't exist, insert details into the students table
        const dummyPhotoValue = "default_photo_url"; // Replace with your desired default photo URL
        const studentInsertQuery = `
          INSERT INTO students (stud_name, email, Phone, photo) 
          VALUES (?, ?, ?, ?)
        `;
        const insertResult = await new Promise((resolve, reject) => {
          db.query(
            studentInsertQuery,
            [Name, email, phone, dummyPhotoValue],
            (err, results) => {
              if (err) {
                console.error("Database error while inserting student:", err);
                reject(err);
              } else {
                console.log("Student details inserted successfully");
                resolve(results);
              }
            }
          );
        });
        const studentCheckQuery = `SELECT stud_id FROM students WHERE stud_name = ?`;
      const newStudent = await new Promise((resolve, reject) => {
        db.query(studentCheckQuery, [Name], (err, results) => {
          if (err) {
            console.error("Database error while checking student name:", err);
            reject(err);
          } else {
            resolve(results[0]); // Resolve with the first matching student
          }
        });
      });
      stud_id = newStudent.stud_id;
      }

      // Store `stud_id` in session
      req.session.stud_id = stud_id;
      req.session.stud_name = Name;
      console.log(`Stored stud_id in session: ${req.session.stud_id}`);

      // Respond with a success message
      return res.json({
        message: "Login successful",
        stud_id: req.session.stud_id,
      });
    } catch (err) {
      console.error("Error in login process:", err);
      return res.status(500).json({
        error: "Server Error",
        details: err.message,
      });
    }
  })
);


router.get("/exams", async (req, res) => {

    const query2 = "SELECT exam_id, exam_name, dept, slot, fees, duration FROM exams";
    
    try {
      const results = await new Promise((resolve, reject) => {
        db.query(query2, (err, results) => {
          if (err) {
            reject(err); // Pass the error to the catch block
          } else {
            resolve(results); // Pass the results to the await call
          }
        });
      });
  
      res.json(results); // Send the fetched data as a JSON response
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to fetch exams" });
    }
  });


router.post('/uploadPhoto', (req, res) => {
  const { photo, exam_id } = req.body;
  const stud_id = req.session.stud_id;

  if (!photo || !exam_id || !stud_id) {
    return res.status(400).json({ error: 'Missing photo, exam_id or student_id' });
  }

  const filename = `exam_${exam_id}_${Date.now()}.png`;
  const fs = require('fs');
  const path = require('path');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');

// Check and create if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

  const filepath = path.join(uploadDir, filename);

  const base64Data = photo.replace(/^data:image\/png;base64,/, '');

  fs.writeFile(filepath, base64Data, 'base64', (err) => {
    if (err) {
      console.error("Error saving photo:", err);
      return res.status(500).json({ error: 'Failed to save photo' });
    }

    // Insert into MySQL
    const sql = `INSERT INTO student_photos (stud_id, exam_id, photo_filename) VALUES (?, ?, ?)`;
    db.query(sql, [stud_id, exam_id, filename], (dbErr, result) => {
      if (dbErr) {
        console.error("Error inserting into DB:", dbErr);
        return res.status(500).json({ error: 'Failed to save record in DB' });
      }
      console.log(result)
      res.json({ success: true, message: 'Photo uploaded and recorded successfully', file: filename });
    });
  });
});

function getOldestPhotoPathFromDB(exam_id, student_id, callback) {
  db.query(
    `SELECT photo_filename FROM student_photos 
     WHERE exam_id = ? AND stud_id = ? AND DATE(uploaded_at) = CURDATE()
     ORDER BY uploaded_at ASC LIMIT 1`,
    [exam_id, student_id],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error('No initial photo found for today in DB'));
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
      const fullPath = path.join(uploadsDir, results[0].photo_filename);
      callback(null, fullPath);
    }
  );
}

router.post('/verifyPhoto', (req, res) => {
  const { exam_id, photo } = req.body;
  const student_id = req.session.stud_id;

  getOldestPhotoPathFromDB(exam_id, student_id, (dbErr, initialPhotoPath) => {
    if (dbErr) {
      console.error("DB error:", dbErr.message);
      return res.status(500).json({ error: dbErr.message });
    }

    const form = new FormData();
    form.append('initial_photo', fs.createReadStream(initialPhotoPath));
    form.append('periodic_photo', photo);

    axios.post('http://127.0.0.1:8000/compareBase64', form, {
      headers: form.getHeaders(),
    }).then(response => {
      res.json({
        message: "Face verification done",
        similarity: response.data.similarity,
        verified: response.data.verified,
        error: response.data.error
      });
    }).catch(err => {
      console.error("Verification error:", err.message);
      res.status(500).json({ error: err.message });
    });
  });
});


  router.post("/fees", async (req, res) => {
    const { exam_id, fees } = req.body;
    const stud_id = req.session.stud_id; // Assuming stud_id is stored in the session

    if (!stud_id || !exam_id || !fees) {
      console.error("Missing required fields:", { stud_id, exam_id, fees });
      return res.status(400).json({ error: "Missing required fields" }); // Handle missing data
    }
  
    const date = new Date();
    const formatted_date = date.toISOString().slice(0, 19).replace("T", " ");
  
    const checkQuery = "SELECT * FROM payments WHERE stud_id = ? AND exam_id = ?";
    const insertQuery = "INSERT INTO payments (stud_id, exam_id, fees, payment_date) VALUES (?, ?, ?, ?)";
  
    try {
      // Check if the payment record already exists
      const alreadyPaid = await new Promise((resolve, reject) => {
        db.query(checkQuery, [stud_id, exam_id], (err, results) => {
          if (err) {
            console.error("Error during payment check:", err); // Log query error
            return reject(err);
          }
          console.log("Check query results:", results); // Log results
          resolve(results.length > 0); // Resolve with true if a record exists
        });
      });
  
      if (alreadyPaid) {
        console.log("Payment already exists for stud_id:", stud_id, "exam_id:", exam_id);
        return res.json("Already paid"); // If record exists, respond with "Already paid"
      }
  
      // Insert the payment record if it does not already exist
      const paid = await new Promise((resolve, reject) => {
        db.query(insertQuery, [stud_id, exam_id, fees, formatted_date], (err, results) => {
          if (err) {
            console.error("Error during payment insertion:", err); // Log query error
            return reject(err);
          }
          console.log("Insert query results:", results); // Log results
          resolve(results); // Resolve the promise with the result of the query
        });
      });
  
      console.log("Payment inserted successfully for stud_id:", stud_id, "exam_id:", exam_id);
      return res.json("paid"); // Respond with "paid" if the insertion was successful
    } catch (err) {
      console.error("Database error:", err); // Log the full error
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
router.post("/reschedule", async (req, res) => {
  console.log(req.body)
  const { exam_id, new_slot } = req.body;
  const stud_id = req.session.stud_id; // Assuming the student ID is stored in the session
  const query = `
    INSERT INTO reschedule_requests (stud_id, exam_id, new_slot) 
    VALUES (?, ?, ?)
  `;

  try {
    // Insert the reschedule request into the database
    const result = await new Promise((resolve, reject) => {
      db.query(
        query,
        [stud_id, exam_id, new_slot],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    console.log(result);
    res.json({ message: "Reschedule request submitted successfully.", result });
  } catch (err) {
    console.error("Error inserting reschedule request:", err);
    res.status(500).json({ error: "Failed to submit reschedule request." });
  }
});

router.use("/upcoming", async(req, res) => {
    const query = `SELECT  exam_id, exam_name, slot, duration, total_qs FROM exams 
    WHERE slot BETWEEN DATE_SUB(NOW(), INTERVAL 15 MINUTE) 
               AND DATE_ADD(NOW(), INTERVAL 1 DAY);`;
    
    try {
      const results = await new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) {
            reject(err); // Pass the error to the catch block
          } else {
            resolve(results); // Pass the results to the await call
          }
        });
      });
      res.json(results); // Send the fetched data as a JSON response
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to fetch exams" });
    }
});

router.use("/question", async (req, res) => {
  const { exam_id, difficulty } = req.body;
  const stud_id = req.session.stud_id;
  console.log(exam_id,stud_id, difficulty);

  // Query to check if the student has solved questions for the given exam_id
  const checkQuery = `
    SELECT ques_id, given_ans, ans 
    FROM solved 
    WHERE exam_id = ? AND stud_id = ?;
  `;

  // Query to fetch questions if not already solved
  const questionQuery = `
    SELECT q.ques_id, q.ques, q.opt1, q.opt2, q.opt3, q.opt4, q.ans, q.topic, q.difficulty
    FROM questions q
    JOIN exams e ON q.dept = e.dept
    WHERE e.exam_id = ? AND q.difficulty = ?;

  `;

  try {
    // Check if the student has solved questions
    const solvedResults = await new Promise((resolve, reject) => {
      db.query(checkQuery, [exam_id, stud_id], (err, results) => {
        if (err) {
          reject(err); // Pass the error to the catch block
        } else {
          resolve(results); // Pass the results to the await call
        }
      });
    });

    // If solved results are found, return them
    if (solvedResults.length > 0) {
      return res.json("Test taken!");
    }

    // If not solved, fetch questions for the exam
    const questionsResults = await new Promise((resolve, reject) => {
      db.query(questionQuery, [exam_id, difficulty], (err, results) => {
        if (err) {
          reject(err); // Pass the error to the catch block
        } else {
          console.log(results)
          resolve(results); // Pass the results to the await call
        }
      });
    });

    // Return the questions data
    //console.log(questionsResults);
    res.json(questionsResults);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


router.post("/submit", async (req, res) => {
  const quesTime = req.body.questionTimes;
  const exam_id = req.body.examId;
  const given_ans = req.body.selectedAnswers;
  const ques = req.body.questions;
  const stud_id = req.session.stud_id;

  let score = 0;

  // Calculate score
  ques.forEach((q, i) => {
    if (given_ans[i]) {
      if (given_ans[i] === q.ans) {
        score += 1;
      }
    }
  });

  const total_qs = ques.length;

  // Insert into `dashboard` table
  const dashboardQuery = `
    INSERT INTO dashboard (stud_id, exam_id, score, total_qs)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await new Promise((resolve, reject) => {
      db.query(dashboardQuery, [stud_id, exam_id, score, total_qs], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error("Error saving result to dashboard:", error);
    return res.status(500).json({ error: "Failed to save data to dashboard" });
  }

  // Insert into `exam_portal` table and `solved` table
  const examPortalQuery = `
    INSERT INTO exam_portal (exam_id, stud_id, ques_id, time_spent)
    VALUES (?, ?, ?, ?)
  `;

  const solvedQuery = `
    INSERT INTO solved (given_ans, ans, stud_id, ques_id, exam_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await new Promise((resolve, reject) => {
      db.beginTransaction(async (transactionErr) => {
        if (transactionErr) return reject(transactionErr);

        try {
          for (let i = 0; i < ques.length; i++) {
            const ques_id = ques[i].ques_id;
            const time_spent = quesTime[i] || 0;
            const correct_ans = ques[i].ans;
            const user_ans = given_ans[i] || null;

            // Insert into `exam_portal`
            await new Promise((resolveInner, rejectInner) => {
              db.query(
                examPortalQuery,
                [exam_id, stud_id, ques_id, time_spent],
                (err) => {
                  if (err) {
                    rejectInner(err);
                  } else {
                    resolveInner();
                  }
                }
              );
            });

            // Insert into `solved`
            await new Promise((resolveInner, rejectInner) => {
              db.query(
                solvedQuery,
                [user_ans, correct_ans, stud_id, ques_id,exam_id],
                (err) => {
                  if (err) {
                    rejectInner(err);
                  } else {
                    resolveInner();
                  }
                }
              );
            });
          }

          db.commit((commitErr) => {
            if (commitErr) return reject(commitErr);
            resolve();
          });
        } catch (err) {
          db.rollback(() => reject(err));
        }
      });
    });

    res.json({ message: "Data successfully saved to exam_portal and solved tables!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data to exam_portal or solved table" });
  }
});

router.post("/results", async (req, res) => {
  const stud_id = req.session.stud_id;
  console.log(stud_id);
  const query = `
    SELECT exam_id, score, total_qs, 
           (SELECT exam_name FROM exams WHERE exams.exam_id = dashboard.exam_id) AS exam_name
    FROM dashboard 
    WHERE stud_id = ?
    ORDER BY result_id DESC
  `;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [stud_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

router.post("/analysis", async (req, res) => {
  console.log(req.body);
  const exam_id = req.body.examId;
  const stud_id = req.session.stud_id;
  //console.log(stud_id,exam_id)
  const dashboardQuery = `
    SELECT score, total_qs
    FROM dashboard
    WHERE stud_id = ? AND exam_id = ?;
  `;
  const timeSpentQuery = `
    SELECT ques_id, time_spent
    FROM exam_portal
    WHERE stud_id = ? AND exam_id = ?;
  `;
  const difficultyQuery = `
    SELECT difficulty, COUNT(*) AS count
    FROM questions
    WHERE exam_id = ?
    GROUP BY difficulty;
  `;
  const topicPerformanceQuery = `
SELECT topic, 
COUNT(CASE WHEN given_ans = solved.ans THEN 1 END) AS correct_count,
COUNT(*) AS total_count
FROM solved
INNER JOIN questions ON solved.ques_id = questions.ques_id
WHERE solved.exam_id= ? AND solved.stud_id = ?
GROUP BY topic
ORDER BY COUNT(CASE WHEN given_ans = solved.ans THEN 1 END) / COUNT(*) DESC;
  `;
const rankQ = `SELECT rank
FROM (
    SELECT  
        stud_id,
        RANK() OVER (ORDER BY score DESC) AS rank
    FROM dashboard
    WHERE exam_id = ?
) ranked
WHERE stud_id = ?;
;`

const percentileQ = `WITH ScoreData AS (
    SELECT stud_id, score
    FROM dashboard
    WHERE exam_id = ?
),
StudentScore AS (
    SELECT score FROM dashboard WHERE stud_id = ? AND exam_id = ?
),
TotalStudents AS (
    SELECT COUNT(*) AS total FROM ScoreData
),
LowerScores AS (
    SELECT COUNT(*) AS lower FROM ScoreData WHERE score <= (SELECT score FROM StudentScore)
)

SELECT 
    (SELECT lower FROM LowerScores) * 100.0 / (SELECT total FROM TotalStudents) AS percentile;
`

console.log(stud_id,exam_id)
  try {
    // Parallel execution of queries
    const [dashboardResults, timeSpentResults, difficultyResults, topicPerformanceResults, rank, percentile] =
      await Promise.all([
        new Promise((resolve, reject) =>
          db.query(dashboardQuery, [stud_id, exam_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),
        new Promise((resolve, reject) =>
          db.query(timeSpentQuery, [stud_id, exam_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),
        new Promise((resolve, reject) =>
          db.query(difficultyQuery, [exam_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),
        new Promise((resolve, reject) =>
          db.query(topicPerformanceQuery, [exam_id, stud_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),
        new Promise((resolve, reject) =>
          db.query(rankQ, [exam_id,stud_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),new Promise((resolve, reject) =>
          db.query(percentileQ, [exam_id, stud_id, exam_id, stud_id, exam_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        )
      ]);
    //console.log(dashboardResults)
    // Process results
    const { score, total_qs } = dashboardResults[0];
    const accuracyData = [
      { name: "Correct", value: score },
      { name: "Incorrect", value: total_qs - score },
    ];

    let timeSpentData = timeSpentResults.map(({ ques_id, time_spent }) => ({
      question: `Q${ques_id}`,
      time: time_spent,
    }));

    const difficultyData = difficultyResults.map(({ difficulty, count }) => ({
      name: difficulty,
      value: count,
    }));
    //console.log(topicPerformanceResults);
    const strengths = topicPerformanceResults
      .slice(0, 2)
      .map(({ topic }) => topic);
    const weaknesses = topicPerformanceResults
      .slice(-2)
      .map(({ topic }) => topic);
      //console.log(strengths,weaknesses);
      timeSpentData = timeSpentData.map((entry) => {
        const [hours, minutes, seconds] = entry.time.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return { ...entry, time: totalSeconds };
      });
      console.log(rank);
      let Rank=rank[0].rank
      let Percentile= percentile[0].percentile
      //console.log(Rank, Percentile);
    // Send response
    res.json({
      accuracyData,
      timeSpentData,
      difficultyData,
      strengths,
      weaknesses,
      Rank,
      Percentile,
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).send("Logged out successfully");
  });
});

router.post("/examQuestions", async (req, res) => {
    const { exam_id } = req.body;
    const stud_id = req.session.stud_id; // Assuming session holds the student ID
    //console.log(exam_id);
    if (!exam_id || !stud_id) {
        return res.status(400).json({ error: "Missing exam_id or student session." });
    }

    const query = `
        SELECT q.ques_id, q.ques, q.opt1, q.opt2, q.opt3, q.opt4, q.ans AS correct_ans, 
               s.given_ans 
        FROM questions q
        LEFT JOIN solved s ON q.ques_id = s.ques_id AND s.stud_id = ? AND s.exam_id = ? AND s.exam_id=q.exam_id
        WHERE q.exam_id = ?;
    `;

    try {
      const results = await new Promise((resolve, reject) => {
        db.query(query, [stud_id,exam_id,exam_id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      //console.log(results);
      res.json(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ error: "Failed to fetch results" });
    }
});


module.exports = router;
  