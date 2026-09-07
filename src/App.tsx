import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import RoleSelection from "./pages/auth/RoleSelection";
import StudentSignup from "./pages/auth/StudentSignup";
import CollegeSignup from "./pages/auth/CollegeSignup";
import CompanySignup from "./pages/auth/CompanySignup";
import Login from "./pages/auth/Login";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSkills from "./pages/student/StudentSkills";
import StudentProjects from "./pages/student/StudentProjects";
import StudentOpportunities from "./pages/student/StudentOpportunities";
import StudentApplications from "./pages/student/StudentApplications";
import StudentResume from "./pages/student/StudentResume";

import CollegeDashboard from "./pages/college/CollegeDashboard";
import CollegeStudents from "./pages/college/CollegeStudents";
import CollegeSkillAnalytics from "./pages/college/CollegeSkillAnalytics";
import CollegePlacementAnalytics from "./pages/college/CollegePlacementAnalytics";
import CollegeShowcase from "./pages/college/CollegeShowcase";
import CollegeCompanies from "./pages/college/CollegeCompanies";

import CompanyDashboard from "./pages/company/CompanyDashboard";
import PostJob from "./pages/company/PostJob";
import CompanyJobs from "./pages/company/CompanyJobs";
import CompanyCandidates from "./pages/company/CompanyCandidates";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyProfile from "./pages/company/CompanyProfile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route path="/" element={<Home />} />

        <Route path="/roles" element={<RoleSelection />} />

        <Route path="/login" element={<Login />} />

        {/* Signup Routes */}
        <Route
          path="/signup/student"
          element={<StudentSignup />}
        />

        <Route
          path="/signup/college"
          element={<CollegeSignup />}
        />

        <Route
          path="/signup/company"
          element={<CompanySignup />}
        />

        {/* ==================== STUDENT ROUTES ==================== */}

        <Route element={<ProtectedRoute allowedRole="student" />}>
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/profile"
            element={<StudentProfile />}
          />

          <Route
            path="/student/skills"
            element={<StudentSkills />}
          />

          <Route
            path="/student/projects"
            element={<StudentProjects />}
          />

          <Route
            path="/student/opportunities"
            element={<StudentOpportunities />}
          />

          <Route
            path="/student/applications"
            element={<StudentApplications />}
          />

          <Route
            path="/student/resume"
            element={<StudentResume />}
          />
        </Route>

        {/* ==================== COLLEGE ROUTES ==================== */}

        <Route element={<ProtectedRoute allowedRole="college" />}>
          <Route
            path="/college/dashboard"
            element={<CollegeDashboard />}
          />

          <Route
            path="/college/students"
            element={<CollegeStudents />}
          />

          <Route
            path="/college/skills"
            element={<CollegeSkillAnalytics />}
          />

          <Route
            path="/college/placements"
            element={<CollegePlacementAnalytics />}
          />

          <Route
            path="/college/showcase"
            element={<CollegeShowcase />}
          />

          <Route
            path="/college/companies"
            element={<CollegeCompanies />}
          />
        </Route>

        {/* ==================== COMPANY ROUTES ==================== */}

        <Route element={<ProtectedRoute allowedRole="company" />}>
          <Route
            path="/company/dashboard"
            element={<CompanyDashboard />}
          />

          <Route
            path="/company/jobs"
            element={<CompanyJobs />}
          />

          <Route
            path="/company/jobs/new"
            element={<PostJob />}
          />

          <Route
            path="/company/candidates"
            element={<CompanyCandidates />}
          />

          <Route
            path="/company/applications"
            element={<CompanyApplications />}
          />

          <Route
            path="/company/profile"
            element={<CompanyProfile />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;