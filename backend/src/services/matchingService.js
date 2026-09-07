const db = require("../config/database");

/**
 * Normalize a skill so comparisons are consistent.
 */
function normalizeSkill(skill) {
  return String(skill || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Convert skills from any supported format into an array.
 *
 * Supports:
 * - ["Java", "Python"]
 * - "Java, Python"
 * - '["Java","Python"]'
 * - "Java"
 */
function parseSkills(value) {
  if (!value) return [];

  // Already an array
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => parseSkills(item))
      .map(normalizeSkill)
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    // Try JSON first
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);

        if (Array.isArray(parsed)) {
          return parsed
            .flatMap((item) => parseSkills(item))
            .map(normalizeSkill)
            .filter(Boolean);
        }

        if (parsed && typeof parsed === "object") {
          return Object.values(parsed)
            .flatMap((item) => parseSkills(item))
            .map(normalizeSkill)
            .filter(Boolean);
        }
      } catch (error) {
        // If JSON parsing fails, continue with comma splitting
      }
    }

    return trimmed
      .split(",")
      .map(normalizeSkill)
      .filter(Boolean);
  }

  return [];
}

/**
 * Calculate how well a student matches a job.
 *
 * Weight:
 * - Required skills: 70%
 * - Readiness: 20%
 * - CGPA: 10%
 */
function calculateMatch(jobSkills, studentSkills, readiness = 0, cgpa = 0) {
  const requiredSkills = [...new Set(parseSkills(jobSkills))];
  const candidateSkills = [...new Set(parseSkills(studentSkills))];

  const requiredSet = new Set(requiredSkills);
  const candidateSet = new Set(candidateSkills);

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSet.has(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSet.has(skill)
  );

  const skillMatchPercentage =
    requiredSkills.length > 0
      ? Math.round(
          (matchedSkills.length / requiredSkills.length) * 100
        )
      : 0;

  const skillScore =
    requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 70
      : 0;

  const readinessValue = Math.max(
    0,
    Math.min(100, Number(readiness) || 0)
  );

  const cgpaValue = Math.max(
    0,
    Math.min(10, Number(cgpa) || 0)
  );

  const readinessScore = (readinessValue / 100) * 20;

  const cgpaScore = (cgpaValue / 10) * 10;

  const matchScore = Math.round(
    skillScore + readinessScore + cgpaScore
  );

  return {
    matchScore,
    skillMatchPercentage,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Get all skills belonging to a student.
 */
function getStudentSkills(studentId) {
  const rows = db
    .prepare(
      `
      SELECT s.name
      FROM student_skills ss
      JOIN skills s ON s.id = ss.skill_id
      WHERE ss.student_id = ?
      ORDER BY s.name
      `
    )
    .all(studentId);

  return rows.map((row) => row.name);
}

/**
 * Calculate a student's match for a specific job.
 */
function getStudentJobMatch(studentId, jobId) {
  const job = db
    .prepare(
      `
      SELECT
        id,
        title,
        skills,
        status
      FROM jobs
      WHERE id = ?
      `
    )
    .get(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const student = db
    .prepare(
      `
      SELECT
        id,
        readiness,
        cgpa
      FROM students
      WHERE id = ?
      `
    )
    .get(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const studentSkills = getStudentSkills(studentId);

  return calculateMatch(
    job.skills,
    studentSkills,
    student.readiness,
    student.cgpa
  );
}

module.exports = {
  normalizeSkill,
  parseSkills,
  calculateMatch,
  getStudentSkills,
  getStudentJobMatch,
};