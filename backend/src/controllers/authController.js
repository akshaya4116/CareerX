const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =========================
// SIGNUP
// =========================
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,

      // Student
      college,
      course,
      branch,
      graduationYear,

      // College / Company
      phone,
      location,
      affiliation,
      website,
      industry,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = ["student", "college", "company"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = db.transaction(() => {
      const result = db
        .prepare(
          `
          INSERT INTO users (name, email, password, role)
          VALUES (?, ?, ?, ?)
          `
        )
        .run(name, email.toLowerCase(), hashedPassword, role);

      const userId = result.lastInsertRowid;

      if (role === "student") {
        db.prepare(
          `
          INSERT INTO students
          (user_id, college, course, branch, graduation_year, phone, location)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `
        ).run(
          userId,
          college || "",
          course || "",
          branch || "",
          graduationYear || null,
          phone || "",
          location || ""
        );
      }

      if (role === "college") {
        db.prepare(
          `
          INSERT INTO colleges
          (user_id, college_name, phone, location, affiliation, website)
          VALUES (?, ?, ?, ?, ?, ?)
          `
        ).run(
          userId,
          name,
          phone || "",
          location || "",
          affiliation || "",
          website || ""
        );
      }

      if (role === "company") {
        db.prepare(
          `
          INSERT INTO companies
          (user_id, company_name, industry, location, website)
          VALUES (?, ?, ?, ?, ?)
          `
        ).run(
          userId,
          name,
          industry || "",
          location || "",
          website || ""
        );
      }

      return userId;
    });

    const userId = createUser();

    const user = {
      id: userId,
      name,
      email: email.toLowerCase(),
      role,
    };

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error during signup",
    });
  }
};

// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = db
      .prepare(
        `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
        `
      )
      .get(email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (role && user.role !== role) {
      return res.status(401).json({
        message: "Account role does not match",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(safeUser);

    res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

module.exports = {
  signup,
  login,
};