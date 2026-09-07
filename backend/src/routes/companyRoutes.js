const express = require("express");

const {
  getCompanyDashboard,
  getRecommendedCandidates,
  getCompanyProfile,
  updateCompanyProfile,
} = require("../controllers/companyController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  requireRole("company"),
  getCompanyDashboard
);

router.get(
  "/jobs/:jobId/recommendations",
  verifyToken,
  requireRole("company"),
  getRecommendedCandidates
);
router.get(
  "/profile",
  verifyToken,
  requireRole("company"),
  getCompanyProfile
);

router.put(
  "/profile",
  verifyToken,
  requireRole("company"),
  updateCompanyProfile
);

module.exports = router;