const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin_password";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// Wrapper function to handle async errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Fetch student details entered in registration page and insert into DB:
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if username already exists in the table
      const userExistsQuery = `SELECT COUNT(*) AS count FROM user_registration WHERE username = ?`;
      const userExists = await new Promise((resolve, reject) => {
        db.query(userExistsQuery, [username], (err, results) => {
          if (err) {
            console.error("Database error:", err);
            reject(err);
          } else {
            resolve(results[0].count > 0);
          }
        });
      });

      if (userExists) {
        return res.json("Student exists");
      }

      const hashedPass = await bcrypt.hash(password, 10);
      // Admin login check
      if (
        username === ADMIN_USERNAME &&
        (await bcrypt.compare(password, ADMIN_PASSWORD_HASH))
      ) {
        console.log("Admin login successful");
        return res.json("Admin");
      } else {
        // Insert the new user into the database
        const query = `INSERT INTO user_registration (username, password) VALUES (?, ?)`;
        await new Promise((resolve, reject) => {
          db.query(query, [username, hashedPass], (err, results) => {
            if (err) {
              console.error("Database error:", err);
              reject(err);
            } else {
              console.log("User registered successfully");
              resolve(results);
            }
          });
        });
        return res.json("Student");
      }
    } catch (err) {
      console.error("Error in registration process:", err);
      return res.status(500).json({
        error: "Server Error",
        details: err.message,
      });
    }
  })
);

// Global error handler middleware
router.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({
    error: "An unexpected error occurred",
    details: err.message,
  });
});

module.exports = router;
