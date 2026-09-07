const API_BASE_URL =
  "https://careerx-backend-12hi.onrender.com/api";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

async function authenticatedFetch(
  endpoint: string,
  options: RequestOptions = {}
) {
  const token = localStorage.getItem("careerx_token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token && !options.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data?.message
        ? data.message
        : "Something went wrong"
    );
  }

  return data;
}

/* =========================================================
   AUTH
========================================================= */

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  role: "student" | "college" | "company";
  college?: string;
  course?: string;
  branch?: string;
  graduationYear?: string | number;
  phone?: string;
  location?: string;
  affiliation?: string;
  website?: string;
  industry?: string;
}) {
  return authenticatedFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

export async function login(data: {
  email: string;
  password: string;
  role?: "student" | "college" | "company";
}) {
  return authenticatedFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

/* =========================================================
   STUDENT PROFILE
========================================================= */

export async function getStudentProfile() {
  return authenticatedFetch("/student/profile");
}

export async function updateStudentProfile(data: {
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  course?: string;
  branch?: string;
  graduationYear?: string | number;
  location?: string;
  bio?: string;
  cgpa?: number;
}) {
  return authenticatedFetch("/student/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================================================
   STUDENT SKILLS
========================================================= */

export async function getStudentSkills() {
  return authenticatedFetch("/student/skills");
}

export async function addStudentSkill(data: {
  name: string;
  proficiency: number;
}) {
  return authenticatedFetch("/student/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudentSkill(
  skillId: number,
  data: {
    name: string;
    proficiency: number;
  }
) {
  return authenticatedFetch(`/student/skills/${skillId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudentSkill(skillId: number) {
  return authenticatedFetch(`/student/skills/${skillId}`, {
    method: "DELETE",
  });
}

/* =========================================================
   STUDENT PROJECTS
========================================================= */

export async function getStudentProjects() {
  return authenticatedFetch("/student/projects");
}

export async function addStudentProject(data: {
  title: string;
  description: string;
  technologies: string | string[];
  githubUrl?: string;
  demoUrl?: string;
  type?: string;
  status?: string;
}) {
  return authenticatedFetch("/student/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudentProject(
  projectId: number,
  data: {
    title: string;
    description: string;
    technologies: string | string[];
    githubUrl?: string;
    demoUrl?: string;
    type?: string;
    status?: string;
  }
) {
  return authenticatedFetch(`/student/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudentProject(projectId: number) {
  return authenticatedFetch(`/student/projects/${projectId}`, {
    method: "DELETE",
  });
}

/* =========================================================
   JOBS
========================================================= */

export async function getJobs() {
  return authenticatedFetch("/jobs");
}

export async function getJob(jobId: number) {
  return authenticatedFetch(`/jobs/${jobId}`);
}

export async function createJob(data: {
  title: string;
  type: string;
  location: string;
  mode: string;
  salary?: string;
  deadline?: string;
  description: string;
  eligibility?: string;
  skills?: string[];
}) {
  return authenticatedFetch("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJob(
  jobId: number,
  data: {
    title?: string;
    type?: string;
    location?: string;
    mode?: string;
    salary?: string;
    deadline?: string;
    description?: string;
    eligibility?: string;
    skills?: string[];
    status?: string;
  }
) {
  return authenticatedFetch(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteJob(jobId: number) {
  return authenticatedFetch(`/jobs/${jobId}`, {
    method: "DELETE",
  });
}

/* =========================================================
   STUDENT APPLICATIONS
========================================================= */

export async function applyForJob(jobId: number) {
  return authenticatedFetch(`/applications/jobs/${jobId}/apply`, {
    method: "POST",
  });
}

export async function getStudentApplications() {
  return authenticatedFetch("/applications/student/applications");
}

export async function withdrawApplication(applicationId: number | string) {
  return authenticatedFetch(
    `/applications/student/applications/${applicationId}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   COMPANY APPLICATIONS
========================================================= */

export async function getCompanyApplications() {
  return authenticatedFetch("/applications/company/applications");
}

export async function updateApplicationStatus(
  applicationId: number | string,
  status:
    | "Applied"
    | "Under Review"
    | "Shortlisted"
    | "Rejected"
) {
  return authenticatedFetch(
    `/applications/company/applications/${applicationId}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
}

/* =========================================================
   COMPANY DASHBOARD
========================================================= */

export async function getCompanyDashboard() {
  return authenticatedFetch("/company/dashboard");
}

export async function getRecommendedCandidates(jobId: number) {
  return authenticatedFetch(
    `/company/jobs/${jobId}/recommendations`
  );
}

/* =========================================================
   COMPANY PROFILE
========================================================= */

export async function getCompanyProfile() {
  return authenticatedFetch("/company/profile");
}

export async function updateCompanyProfile(data: {
  companyName: string;
  email: string;
  industry: string;
  location: string;
  website: string;
  description: string;
}) {
  return authenticatedFetch("/company/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* =========================================================
   COLLEGE
========================================================= */

export async function getCollegeDashboard() {
  return authenticatedFetch("/college/dashboard");
}

export async function getCollegeStudents() {
  return authenticatedFetch("/college/students");
}

export async function getCollegeSkillAnalytics() {
  return authenticatedFetch("/college/skills");
}

export async function getCollegePlacementAnalytics() {
  return authenticatedFetch("/college/placements");
}

export async function getCollegeShowcase() {
  return authenticatedFetch("/college/showcase");
}

export async function getCollegeCompanies() {
  return authenticatedFetch("/college/companies");
}

/* =========================================================
   EXPORT
========================================================= */

export { authenticatedFetch };
// Backward-compatible auth function names
export const signupUser = signup;
export const loginUser = login;
export const updateCompanyApplicationStatus = updateApplicationStatus;