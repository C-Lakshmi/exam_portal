const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const app = express();
const PORT = 5000;

const sessionStore = new MySQLStore({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "exam_system",
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24,
      secure: false, 
      httpOnly: true // Prevent client-side access to the cookie
     }, // 1 day
  })
);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// API Routes
const examRoutes = require("./routes/examRoutes");
const Admin = require("./routes/Admin");
const stud = require("./routes/Student");
// Add this route handler
app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});
app.use("/api/auth", examRoutes);
app.use("/api/admin", Admin);
app.use("/api/student", stud);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

