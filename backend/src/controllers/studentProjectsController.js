const db = require("../config/database");

const getStudentId = (userId) => {
  const student = db
    .prepare("SELECT id FROM students WHERE user_id = ?")
    .get(userId);

  return student ? student.id : null;
};

// GET all projects
const getProjects = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const projects = db
      .prepare(`
        SELECT
          id,
          title,
          description,
          technologies,
          github_url,
          demo_url,
          type,
          status
        FROM projects
        WHERE student_id = ?
        ORDER BY id DESC
      `)
      .all(studentId);

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description || "",
      technologies: project.technologies
        ? project.technologies.split(",").map((item) => item.trim())
        : [],
      githubUrl: project.github_url || "",
      demoUrl: project.demo_url || "",
      type: project.type || "",
      status: project.status || "",
    }));

    res.json({
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Get student projects error:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

// ADD project
const addProject = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      demoUrl,
      type,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const technologiesValue = Array.isArray(technologies)
      ? technologies.join(", ")
      : technologies || "";

    const result = db
      .prepare(`
        INSERT INTO projects (
          student_id,
          title,
          description,
          technologies,
          github_url,
          demo_url,
          type,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        studentId,
        title.trim(),
        description || "",
        technologiesValue,
        githubUrl || "",
        demoUrl || "",
        type || "",
        status || ""
      );

    const project = db
      .prepare(`
        SELECT
          id,
          title,
          description,
          technologies,
          github_url,
          demo_url,
          type,
          status
        FROM projects
        WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: "Project added successfully",
      project: {
        id: project.id,
        title: project.title,
        description: project.description || "",
        technologies: project.technologies
          ? project.technologies.split(",").map((item) => item.trim())
          : [],
        githubUrl: project.github_url || "",
        demoUrl: project.demo_url || "",
        type: project.type || "",
        status: project.status || "",
      },
    });
  } catch (error) {
    console.error("Add student project error:", error);

    res.status(500).json({
      message: "Failed to add project",
    });
  }
};

// UPDATE project
const updateProject = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);
    const projectId = Number(req.params.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      demoUrl,
      type,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const technologiesValue = Array.isArray(technologies)
      ? technologies.join(", ")
      : technologies || "";

    const result = db
      .prepare(`
        UPDATE projects
        SET
          title = ?,
          description = ?,
          technologies = ?,
          github_url = ?,
          demo_url = ?,
          type = ?,
          status = ?
        WHERE id = ? AND student_id = ?
      `)
      .run(
        title.trim(),
        description || "",
        technologiesValue,
        githubUrl || "",
        demoUrl || "",
        type || "",
        status || "",
        projectId,
        studentId
      );

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const project = db
      .prepare(`
        SELECT
          id,
          title,
          description,
          technologies,
          github_url,
          demo_url,
          type,
          status
        FROM projects
        WHERE id = ?
      `)
      .get(projectId);

    res.json({
      message: "Project updated successfully",
      project: {
        id: project.id,
        title: project.title,
        description: project.description || "",
        technologies: project.technologies
          ? project.technologies.split(",").map((item) => item.trim())
          : [],
        githubUrl: project.github_url || "",
        demoUrl: project.demo_url || "",
        type: project.type || "",
        status: project.status || "",
      },
    });
  } catch (error) {
    console.error("Update student project error:", error);

    res.status(500).json({
      message: "Failed to update project",
    });
  }
};

// DELETE project
const deleteProject = (req, res) => {
  try {
    const studentId = getStudentId(req.user.id);
    const projectId = Number(req.params.id);

    if (!studentId) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const result = db
      .prepare(`
        DELETE FROM projects
        WHERE id = ? AND student_id = ?
      `)
      .run(projectId, studentId);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete student project error:", error);

    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};