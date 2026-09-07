const db = require("../config/database");

// GET /api/jobs
const getJobs = (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT
        jobs.*,
        companies.company_name
      FROM jobs
      LEFT JOIN companies
        ON jobs.company_id = companies.id
      WHERE jobs.status = 'Active'
      ORDER BY jobs.id DESC
    `).all();

    const formattedJobs = jobs.map((job) => ({
      ...job,
      company: job.company_name || "Company",
      skills: job.skills
        ? job.skills.split(",").map((skill) => skill.trim())
        : [],
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
};

// GET /api/jobs/:id
const getJob = (req, res) => {
  try {
    const job = db.prepare(`
      SELECT
        jobs.*,
        companies.company_name
      FROM jobs
      LEFT JOIN companies
        ON jobs.company_id = companies.id
      WHERE jobs.id = ?
    `).get(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json({
      ...job,
      company: job.company_name || "Company",
      skills: job.skills
        ? job.skills.split(",").map((skill) => skill.trim())
        : [],
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      message: "Failed to fetch job",
    });
  }
};

// POST /api/jobs
const createJob = (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Only companies can post jobs",
      });
    }

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

    const {
      title,
      type,
      location,
      mode,
      salary,
      deadline,
      description,
      eligibility,
      skills,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Job title and description are required",
      });
    }

    const skillsString = Array.isArray(skills)
      ? skills.join(",")
      : String(skills || "");

    const result = db.prepare(`
      INSERT INTO jobs (
        company_id,
        title,
        type,
        location,
        mode,
        salary,
        deadline,
        description,
        eligibility,
        skills,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')
    `).run(
      company.id,
      title,
      type || "Internship",
      location || "",
      mode || "On-site",
      salary || "",
      deadline || "",
      description,
      eligibility || "",
      skillsString
    );

    res.status(201).json({
      message: "Job created successfully",
      jobId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      message: "Failed to create job",
    });
  }
};

// PUT /api/jobs/:id
const updateJob = (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Only companies can update jobs",
      });
    }

    const company = db.prepare(`
      SELECT id
      FROM companies
      WHERE user_id = ?
    `).get(req.user.id);

    const job = db.prepare(`
      SELECT *
      FROM jobs
      WHERE id = ? AND company_id = ?
    `).get(req.params.id, company?.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const {
      title,
      type,
      location,
      mode,
      salary,
      deadline,
      description,
      eligibility,
      skills,
      status,
    } = req.body;

    const skillsString = Array.isArray(skills)
      ? skills.join(",")
      : String(skills ?? job.skills ?? "");

    db.prepare(`
      UPDATE jobs
      SET
        title = ?,
        type = ?,
        location = ?,
        mode = ?,
        salary = ?,
        deadline = ?,
        description = ?,
        eligibility = ?,
        skills = ?,
        status = ?
      WHERE id = ? AND company_id = ?
    `).run(
      title ?? job.title,
      type ?? job.type,
      location ?? job.location,
      mode ?? job.mode,
      salary ?? job.salary,
      deadline ?? job.deadline,
      description ?? job.description,
      eligibility ?? job.eligibility,
      skillsString,
      status ?? job.status,
      req.params.id,
      company.id
    );

    res.json({
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({
      message: "Failed to update job",
    });
  }
};

// DELETE /api/jobs/:id
const deleteJob = (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Only companies can delete jobs",
      });
    }

    const company = db.prepare(`
      SELECT id
      FROM companies
      WHERE user_id = ?
    `).get(req.user.id);

    const job = db.prepare(`
      SELECT id
      FROM jobs
      WHERE id = ? AND company_id = ?
    `).get(req.params.id, company?.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    db.prepare(`
      DELETE FROM jobs
      WHERE id = ? AND company_id = ?
    `).run(req.params.id, company.id);

    res.json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      message: "Failed to delete job",
    });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};