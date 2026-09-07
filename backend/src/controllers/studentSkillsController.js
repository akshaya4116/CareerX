const db = require("../config/database");

const getStudentId = (userId) => {
  const student = db
    .prepare("SELECT id FROM students WHERE user_id = ?")
    .get(userId);

  return student ? student.id : null;
};

// Get all skills of logged-in student
const getSkills = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const skills = db
      .prepare(`
        SELECT
          ss.id,
          s.id AS skill_id,
          s.name,
          ss.proficiency
        FROM student_skills ss
        JOIN skills s ON s.id = ss.skill_id
        WHERE ss.student_id = ?
        ORDER BY s.name ASC
      `)
      .all(studentId);

    res.json({ skills });
  } catch (error) {
    console.error("Get student skills error:", error);

    res.status(500).json({
      message: "Failed to fetch skills",
    });
  }
};

// Add a new skill
const addSkill = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const { name, proficiency } = req.body;

    if (!name || proficiency === undefined) {
      return res.status(400).json({
        message: "Skill name and proficiency are required",
      });
    }

    const skillName = name.trim();

    if (!skillName) {
      return res.status(400).json({
        message: "Skill name cannot be empty",
      });
    }

    const skillProficiency = Math.max(
      0,
      Math.min(100, Number(proficiency))
    );

    // Create skill if it doesn't exist
    db.prepare(`
      INSERT OR IGNORE INTO skills (name)
      VALUES (?)
    `).run(skillName);

    const skill = db
      .prepare("SELECT id, name FROM skills WHERE name = ?")
      .get(skillName);

    // Prevent duplicate student skill
    const existing = db
      .prepare(`
        SELECT id
        FROM student_skills
        WHERE student_id = ? AND skill_id = ?
      `)
      .get(studentId, skill.id);

    if (existing) {
      return res.status(409).json({
        message: "You already added this skill",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO student_skills
          (student_id, skill_id, proficiency)
        VALUES (?, ?, ?)
      `)
      .run(
        studentId,
        skill.id,
        skillProficiency
      );

    const createdSkill = db
      .prepare(`
        SELECT
          ss.id,
          s.id AS skill_id,
          s.name,
          ss.proficiency
        FROM student_skills ss
        JOIN skills s ON s.id = ss.skill_id
        WHERE ss.id = ?
      `)
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Skill added successfully",
      skill: createdSkill,
    });
  } catch (error) {
    console.error("Add student skill error:", error);

    res.status(500).json({
      message: "Failed to add skill",
    });
  }
};

// Update proficiency
const updateSkill = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);
    const skillId = Number(req.params.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const { proficiency } = req.body;

    const skillProficiency = Math.max(
      0,
      Math.min(100, Number(proficiency))
    );

    const result = db
      .prepare(`
        UPDATE student_skills
        SET proficiency = ?
        WHERE id = ? AND student_id = ?
      `)
      .run(
        skillProficiency,
        skillId,
        studentId
      );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    const updatedSkill = db
      .prepare(`
        SELECT
          ss.id,
          s.id AS skill_id,
          s.name,
          ss.proficiency
        FROM student_skills ss
        JOIN skills s ON s.id = ss.skill_id
        WHERE ss.id = ?
      `)
      .get(skillId);

    res.json({
      message: "Skill updated successfully",
      skill: updatedSkill,
    });
  } catch (error) {
    console.error("Update student skill error:", error);

    res.status(500).json({
      message: "Failed to update skill",
    });
  }
};

// Delete skill
const deleteSkill = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);
    const skillId = Number(req.params.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const result = db
      .prepare(`
        DELETE FROM student_skills
        WHERE id = ? AND student_id = ?
      `)
      .run(skillId, studentId);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete student skill error:", error);

    res.status(500).json({
      message: "Failed to delete skill",
    });
  }
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};