const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const session = require("express-session");

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
  const { exam_id, new_slot } = req.body;
  const stud_id = req.session.stud_id; // Assuming the student ID is stored in the session
  const request_status = "Pending";

  const query = `
    INSERT INTO reschedule_requests (stud_id, exam_id, new_slot, request_status) 
    VALUES (?, ?, ?, ?)
  `;

  try {
    // Insert the reschedule request into the database
    const result = await new Promise((resolve, reject) => {
      db.query(
        query,
        [exam_id, stud_id, new_date, new_start_time, new_end_time, request_status],
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
    const query = `SELECT  exam_id, exam_name, slot, duration FROM exams 
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
  const { exam_id } = req.body;
  const stud_id = req.session.stud_id;

  // Query to check if the student has solved questions for the given exam_id
  const checkQuery = `
    SELECT ques_id, given_ans, ans 
    FROM solved 
    WHERE exam_id = ? AND stud_id = ?;
  `;

  // Query to fetch questions if not already solved
  const questionQuery = `
    SELECT ques_id, ques, opt1, opt2, opt3, opt4, ans, topic, difficulty 
    FROM questions 
    WHERE exam_id = ?;
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
      db.query(questionQuery, [exam_id], (err, results) => {
        if (err) {
          reject(err); // Pass the error to the catch block
        } else {
          resolve(results); // Pass the results to the await call
        }
      });
    });

    // Return the questions data
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
  //console.log(stud_id)
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
WHERE solved.stud_id = ? AND solved.exam_id= ?
GROUP BY topic
ORDER BY COUNT(CASE WHEN given_ans = solved.ans THEN 1 END) / COUNT(*) DESC;
  `;
console.log(stud_id,exam_id)
  try {
    // Parallel execution of queries
    const [dashboardResults, timeSpentResults, difficultyResults, topicPerformanceResults] =
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
          db.query(topicPerformanceQuery, [stud_id,exam_id], (err, results) =>
            err ? reject(err) : resolve(results)
          )
        ),
      ]);
    console.log(dashboardResults)
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

    const strengths = topicPerformanceResults
      .slice(0, 2)
      .map(({ topic }) => topic);
    const weaknesses = topicPerformanceResults
      .slice(-2)
      .map(({ topic }) => topic);
      console.log(strengths,weaknesses);
      timeSpentData = timeSpentData.map((entry) => {
        const [hours, minutes, seconds] = entry.time.split(":").map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        return { ...entry, time: totalSeconds };
      });
      
      console.log(topicPerformanceResults);
    // Send response
    res.json({
      accuracyData,
      timeSpentData,
      difficultyData,
      strengths,
      weaknesses,
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});


module.exports = router;
  