const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Initialize database
require("./config/initDatabase");

// Authentication middleware
const {
  verifyToken,
  requireRole,
} = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentSkillsRoutes = require("./routes/studentSkillsRoutes");
const studentProjectsRoutes = require("./routes/studentProjectsRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyRoutes = require("./routes/companyRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://career-x-hmxe.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CareerX Backend is running",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CareerX API",
    database: "SQLite",
  });
});

// ===============================
// AUTHENTICATION ROUTES
// ===============================

app.use("/api/auth", authRoutes);

// ===============================
// STUDENT ROUTES
// ===============================
app.use("/api/student", studentRoutes);
// Student Skills
app.use("/api/student/skills", studentSkillsRoutes);

// Student Projects
app.use("/api/student/projects", studentProjectsRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api/company", companyRoutes);


// ===============================
// AUTHENTICATED USER
// ===============================

app.get(
  "/api/auth/me",
  verifyToken,
  (req, res) => {
    res.json({
      message: "Authenticated successfully",
      user: req.user,
    });
  }
);

// ===============================
// STUDENT TEST ROUTE
// ===============================

app.get(
  "/api/student/test",
  verifyToken,
  requireRole("student"),
  (req, res) => {
    res.json({
      message: "Student access granted",
      user: req.user,
    });
  }
);

// ===============================
// COLLEGE TEST ROUTE
// ===============================

app.get(
  "/api/college/test",
  verifyToken,
  requireRole("college"),
  (req, res) => {
    res.json({
      message: "College access granted",
      user: req.user,
    });
  }
);

// ===============================
// COMPANY TEST ROUTE
// ===============================

app.get(
  "/api/company/test",
  verifyToken,
  requireRole("company"),
  (req, res) => {
    res.json({
      message: "Company access granted",
      user: req.user,
    });
  }
);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CareerX backend running on http://localhost:${PORT}`
  );
});