const express = require("express");

const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getJobs
);

router.get(
  "/:id",
  verifyToken,
  getJob
);

router.post(
  "/",
  verifyToken,
  requireRole("company"),
  createJob
);

router.put(
  "/:id",
  verifyToken,
  requireRole("company"),
  updateJob
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("company"),
  deleteJob
);

module.exports = router;