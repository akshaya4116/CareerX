const express = require("express");

const {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/studentProjectsController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("student"));

router.get("/", getProjects);
router.post("/", addProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;