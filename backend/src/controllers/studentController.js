const db = require("../config/database");

const getStudentByUserId = (userId) => {
  return db
    .prepare(
      `
      SELECT
        s.id,
        s.user_id,
        u.name,
        u.email,
        s.college,
        s.course,
        s.branch,
        s.graduation_year,
        s.phone,
        s.location,
        s.bio,
        s.cgpa,
        s.readiness
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.user_id = ?
      `
    )
    .get(userId);
};

const formatStudent = (student) => ({
  id: student.id,
  userId: student.user_id,
  fullName: student.name,
  email: student.email,
  college: student.college || "",
  course: student.course || "",
  branch: student.branch || "",
  graduationYear: student.graduation_year || "",
  phone: student.phone || "",
  location: student.location || "",
  bio: student.bio || "",
  cgpa: student.cgpa || "",
  readiness: student.readiness || 0,
});

const getProfile = (req, res) => {
  try {
    const student = getStudentByUserId(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    res.json({
      student: formatStudent(student),
    });
  } catch (error) {
    console.error("Get student profile error:", error);

    res.status(500).json({
      message: "Failed to fetch student profile",
    });
  }
};

const updateProfile = (req, res) => {
  try {
    const {
      fullName,
      phone,
      college,
      course,
      branch,
      graduationYear,
      location,
      bio,
      cgpa,
    } = req.body;

    const student = getStudentByUserId(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const updateProfileTransaction = db.transaction(() => {
      db.prepare(
        `
        UPDATE users
        SET name = ?
        WHERE id = ?
        `
      ).run(
        fullName || student.name,
        req.user.id
      );

      db.prepare(
        `
        UPDATE students
        SET
          college = ?,
          course = ?,
          branch = ?,
          graduation_year = ?,
          phone = ?,
          location = ?,
          bio = ?,
          cgpa = ?
        WHERE user_id = ?
        `
      ).run(
        college ?? student.college,
        course ?? student.course,
        branch ?? student.branch,
        graduationYear
          ? Number(graduationYear)
          : student.graduation_year,
        phone ?? student.phone,
        location ?? student.location,
        bio ?? student.bio,
        cgpa !== undefined && cgpa !== ""
          ? Number(cgpa)
          : student.cgpa,
        req.user.id
      );
    });

    updateProfileTransaction();

    const updatedStudent = getStudentByUserId(req.user.id);

    res.json({
      message: "Student profile updated successfully",
      student: formatStudent(updatedStudent),
    });
  } catch (error) {
    console.error("Update student profile error:", error);

    res.status(500).json({
      message: "Failed to update student profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};