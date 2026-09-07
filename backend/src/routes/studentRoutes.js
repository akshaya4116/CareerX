const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/studentController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);
router.use(requireRole("student"));

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

module.exports = router;