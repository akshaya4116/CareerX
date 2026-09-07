const db = require("../config/database");
const {
  getStudentSkills,
  calculateMatch,
} = require("../services/matchingService");

const getCompanyDashboard = (req, res) => {
  try {
    const company = db
      .prepare(`
        SELECT id, company_name, industry, location
        FROM companies
        WHERE user_id = ?
      `)
      .get(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const activeJobs = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM jobs
        WHERE company_id = ? AND status = 'Active'
      `)
      .get(company.id).count;

    const applications = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE jobs.company_id = ?
      `)
      .get(company.id).count;

    const shortlisted = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE jobs.company_id = ?
          AND applications.status = 'Shortlisted'
      `)
      .get(company.id).count;

    const reviewed = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        WHERE jobs.company_id = ?
          AND applications.status IN (
            'Under Review',
            'Shortlisted',
            'Rejected'
          )
      `)
      .get(company.id).count;

    const jobs = db
      .prepare(`
        SELECT
          jobs.id,
          jobs.title,
          jobs.type,
          jobs.location,
          COUNT(applications.id) AS applications
        FROM jobs
        LEFT JOIN applications
          ON applications.job_id = jobs.id
        WHERE jobs.company_id = ?
          AND jobs.status = 'Active'
        GROUP BY jobs.id
        ORDER BY jobs.id DESC
        LIMIT 5
      `)
      .all(company.id);

    const candidates = db
      .prepare(`
        SELECT
          students.id,
          users.name,
          users.email,
          students.college,
          students.course,
          students.branch,
          students.cgpa,
          students.readiness
        FROM applications
        JOIN jobs ON applications.job_id = jobs.id
        JOIN students ON applications.student_id = students.id
        JOIN users ON students.user_id = users.id
        WHERE jobs.company_id = ?
        ORDER BY applications.id DESC
        LIMIT 3
      `)
      .all(company.id);

    res.json({
      company: {
        id: company.id,
        companyName: company.company_name,
        industry: company.industry || "Technology",
        location: company.location || "",
      },

      stats: {
        activeJobs,
        applications,
        shortlisted,
        reviewed,
      },

      jobs,
      candidates,
    });
  } catch (error) {
    console.error("Company dashboard error:", error);

    res.status(500).json({
      message: "Failed to load company dashboard",
    });
  }
};


/* =========================================================
   SMART CANDIDATE RECOMMENDATIONS
   ========================================================= */

const getRecommendedCandidates = (req, res) => {
  try {
    const company = db
      .prepare(`
        SELECT id
        FROM companies
        WHERE user_id = ?
      `)
      .get(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const job = db
      .prepare(`
        SELECT
          id,
          title,
          skills
        FROM jobs
        WHERE id = ?
          AND company_id = ?
      `)
      .get(req.params.jobId, company.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const students = db
      .prepare(`
        SELECT
          students.id,
          users.name,
          users.email,
          students.college,
          students.course,
          students.branch,
          students.cgpa,
          students.readiness
        FROM students
        JOIN users
          ON students.user_id = users.id
      `)
      .all();

    const candidates = students.map((student) => {
      const studentSkills = getStudentSkills(student.id);

      const match = calculateMatch({
        studentSkills,
        jobSkills: job.skills,
        readiness: student.readiness,
        cgpa: student.cgpa,
      });

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        college: student.college || "",
        course: student.course || "",
        branch: student.branch || "",
        cgpa: Number(student.cgpa) || 0,
        readiness: Number(student.readiness) || 0,

        skills: studentSkills,

        matchScore: match.matchScore,
        skillMatchPercentage: match.skillMatchPercentage,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
      };
    });

    // Highest match first
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      job: {
        id: job.id,
        title: job.title,
      },

      candidates,
    });
  } catch (error) {
    console.error("Recommended candidates error:", error);

    res.status(500).json({
      message:
        error.message || "Failed to load recommended candidates",
    });
  }
};
const getCompanyProfile = (req, res) => {
  try {
    const company = db
      .prepare(`
        SELECT
          c.id,
          c.company_name AS companyName,
          u.email,
          c.industry,
          c.location,
          c.website,
          c.description
        FROM companies c
        JOIN users u ON u.id = c.user_id
        WHERE c.user_id = ?
      `)
      .get(req.user.id);

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    res.json(company);
  } catch (error) {
    console.error("Get company profile error:", error);
    res.status(500).json({ message: "Failed to load company profile" });
  }
};

const updateCompanyProfile = (req, res) => {
  try {
    const {
      companyName,
      email,
      industry,
      location,
      website,
      description,
    } = req.body;

    const company = db
      .prepare("SELECT id FROM companies WHERE user_id = ?")
      .get(req.user.id);

    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const updateCompany = db.prepare(`
      UPDATE companies
      SET
        company_name = ?,
        industry = ?,
        location = ?,
        website = ?,
        description = ?
      WHERE user_id = ?
    `);

    const updateUser = db.prepare(`
      UPDATE users
      SET email = ?
      WHERE id = ?
    `);

    const transaction = db.transaction(() => {
      updateCompany.run(
        companyName,
        industry,
        location,
        website,
        description,
        req.user.id
      );

      updateUser.run(email, req.user.id);
    });

    transaction();

    res.json({
      message: "Company profile updated successfully",
      company: {
        companyName,
        email,
        industry,
        location,
        website,
        description,
      },
    });
  } catch (error) {
    console.error("Update company profile error:", error);
    res.status(500).json({ message: "Failed to update company profile" });
  }
};


module.exports = {
  getCompanyDashboard,
  getRecommendedCandidates,
  getCompanyProfile,
  updateCompanyProfile,
};