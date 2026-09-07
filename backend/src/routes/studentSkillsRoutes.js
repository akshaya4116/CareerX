const express = require("express");

const {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/studentSkillsController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("student"));

router.get("/", getSkills);
router.post("/", addSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;