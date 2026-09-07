const db = require("../config/database");

const {
  getStudentSkills,
  calculateMatch,
} = require("../services/matchingService");

// Student applies for a job
const applyForJob = (req, res) => {
  try {
    const student = db.prepare(`
      SELECT id
      FROM students
      WHERE user_id = ?
    `).get(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const job = db.prepare(`
      SELECT id, company_id, title
      FROM jobs
      WHERE id = ? AND status = 'Active'
    `).get(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found or no longer active",
      });
    }

    const existing = db.prepare(`
      SELECT id
      FROM applications
      WHERE job_id = ? AND student_id = ?
    `).get(job.id, student.id);

    if (existing) {
      return res.status(409).json({
        message: "You have already applied for this job",
      });
    }

    const result = db.prepare(`
      INSERT INTO applications (
        job_id,
        student_id,
        status
      )
      VALUES (?, ?, 'Applied')
    `).run(job.id, student.id);

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    res.status(500).json({
      message: "Failed to submit application",
    });
  }
};


// Get student's applications
const getStudentApplications = (req, res) => {
  try {
    const student = db.prepare(`
      SELECT id
      FROM students
      WHERE user_id = ?
    `).get(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const applications = db.prepare(`
      SELECT
        applications.id,
        applications.job_id,
        applications.status,
        applications.applied_at,
        jobs.title,
        jobs.type,
        jobs.location,
        jobs.mode,
        companies.company_name
      FROM applications
      JOIN jobs
        ON applications.job_id = jobs.id
      LEFT JOIN companies
        ON jobs.company_id = companies.id
      WHERE applications.student_id = ?
      ORDER BY applications.id DESC
    `).all(student.id);

    const formatted = applications.map((application) => ({
      id: String(application.id),
      jobId: String(application.job_id),
      company: application.company_name || "Company",
      role: application.title,
      type: application.type || "Job",
      location: `${application.location || ""}${
        application.mode
          ? ` • ${application.mode}`
          : ""
      }`,
      appliedDate: application.applied_at,
      status: application.status || "Applied",
    }));

    res.json(formatted);
  } catch (error) {
    console.error(
      "Get student applications error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};


// Withdraw student application
const withdrawApplication = (req, res) => {
  try {
    const student = db.prepare(`
      SELECT id
      FROM students
      WHERE user_id = ?
    `).get(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const application = db.prepare(`
      SELECT id
      FROM applications
      WHERE id = ? AND student_id = ?
    `).get(req.params.id, student.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    db.prepare(`
      DELETE FROM applications
      WHERE id = ? AND student_id = ?
    `).run(req.params.id, student.id);

    res.json({
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    console.error(
      "Withdraw application error:",
      error
    );

    res.status(500).json({
      message: "Failed to withdraw application",
    });
  }
};


// Company sees applications
const getCompanyApplications = (req, res) => {
  try {
    const company = db.prepare(`
      SELECT id
      FROM companies
      WHERE user_id = ?
    `).get(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const applications = db.prepare(`
  SELECT
    applications.id,
    applications.status,
    applications.applied_at,
    jobs.id AS job_id,
    jobs.title,
    jobs.type,
    jobs.skills AS job_skills,
    students.id AS student_id,
    users.name AS student_name,
    users.email AS student_email,
    students.college,
    students.branch,
    students.cgpa,
    students.readiness
  FROM applications
  JOIN jobs ON applications.job_id = jobs.id
  JOIN students ON applications.student_id = students.id
  JOIN users ON students.user_id = users.id
  WHERE jobs.company_id = ?
  ORDER BY applications.id DESC
`).all(company.id);

const formattedApplications = applications.map((application) => {
  const studentSkills = getStudentSkills(application.student_id);

  const match = calculateMatch({
    studentSkills,
    jobSkills: application.job_skills,
    readiness: application.readiness,
    cgpa: application.cgpa,
  });

  return {
    id: String(application.id),
    jobId: String(application.job_id),
    candidateId: String(application.student_id),

    candidate: application.student_name,
    email: application.student_email,

    role: application.title,

    college: application.college || "Not specified",
    branch: application.branch || "Not specified",

    cgpa: application.cgpa ?? 0,
    readiness: application.readiness ?? 0,

    type: application.type || "Job",

    status: application.status || "Applied",

    appliedDate: application.applied_at,

    matchScore: match.matchScore,
    skillMatchPercentage: match.skillMatchPercentage,

    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
  };
});

res.json(formattedApplications);  } catch (error) {
  console.error("Get company applications error:", error);

  res.status(500).json({
    message: error.message || "Failed to fetch company applications",
  });
}
};
const updateCompanyApplicationStatus = (req, res) => {
  try {
    const company = db
      .prepare(`SELECT id FROM companies WHERE user_id = ?`)
      .get(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Rejected",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application = db
      .prepare(`
        SELECT
          applications.id,
          applications.status,
          jobs.id AS job_id
        FROM applications
        JOIN jobs
          ON applications.job_id = jobs.id
        WHERE applications.id = ?
          AND jobs.company_id = ?
      `)
      .get(req.params.id, company.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    db.prepare(`
      UPDATE applications
      SET status = ?
      WHERE id = ?
    `).run(status, req.params.id);

    res.json({
      message: "Application status updated successfully",
      applicationId: application.id,
      status,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      message: "Failed to update application status",
    });
  }
};
module.exports = {
  applyForJob,
  getStudentApplications,
  withdrawApplication,
  getCompanyApplications,
  updateCompanyApplicationStatus,
};