const express = require("express");

const {
  applyForJob,
  getStudentApplications,
  withdrawApplication,
  getCompanyApplications,
  updateCompanyApplicationStatus,
} = require("../controllers/applicationController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/jobs/:id/apply",
  verifyToken,
  requireRole("student"),
  applyForJob
);

router.get(
  "/student/applications",
  verifyToken,
  requireRole("student"),
  getStudentApplications
);

router.delete(
  "/student/applications/:id",
  verifyToken,
  requireRole("student"),
  withdrawApplication
);

router.get(
  "/company/applications",
  verifyToken,
  requireRole("company"),
  getCompanyApplications
);
router.put(
  "/company/applications/:id/status",
  verifyToken,
  requireRole("company"),
  updateCompanyApplicationStatus
);

module.exports = router;