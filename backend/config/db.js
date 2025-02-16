const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({
  host: "localhost", // XAMPP default host
  user: "root", // Default username for XAMPP
  password: "", // Leave empty if no password
  database: "exam_system", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = db;
