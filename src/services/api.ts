const API_URL = "http://localhost:5000/api";

export async function signupUser(
  data: Record<string, unknown>
) {
  const response = await fetch(
    `${API_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Signup failed"
    );
  }

  return result;
}

export async function loginUser(
  data: Record<string, unknown>
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Login failed"
    );
  }

  return result;
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem("careerx_token");

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Request failed"
    );
  }

  return result;
}

export async function getCurrentUser() {
  return authenticatedFetch("/auth/me");
}

export async function getStudentProfile() {
  return authenticatedFetch(
    "/student/profile"
  );
}

export async function updateStudentProfile(
  data: Record<string, unknown>
) {
  return authenticatedFetch(
    "/student/profile",
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}
export async function getStudentSkills() {
  return authenticatedFetch("/student/skills");
}

export async function addStudentSkill(
  data: Record<string, unknown>
) {
  return authenticatedFetch("/student/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudentSkill(
  id: number,
  data: Record<string, unknown>
) {
  return authenticatedFetch(`/student/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudentSkill(id: number) {
  return authenticatedFetch(`/student/skills/${id}`, {
    method: "DELETE",
  });
}
export async function getStudentProjects() {
  return authenticatedFetch("/student/projects");
}

export async function addStudentProject(
  data: Record<string, unknown>
) {
  return authenticatedFetch("/student/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStudentProject(
  id: number,
  data: Record<string, unknown>
) {
  return authenticatedFetch(`/student/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStudentProject(id: number) {
  return authenticatedFetch(`/student/projects/${id}`, {
    method: "DELETE",
  });
}
// ===============================
// JOBS & APPLICATIONS
// ===============================

export async function getJobs() {
  return authenticatedFetch("/jobs");
}

export async function getJob(id: number) {
  return authenticatedFetch(`/jobs/${id}`);
}

export async function createJob(
  data: Record<string, unknown>
) {
  return authenticatedFetch("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJob(
  id: number,
  data: Record<string, unknown>
) {
  return authenticatedFetch(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteJob(id: number) {
  return authenticatedFetch(`/jobs/${id}`, {
    method: "DELETE",
  });
}

export async function applyForJob(id: number) {
  return authenticatedFetch(`/jobs/${id}/apply`, {
    method: "POST",
  });
}

export async function getStudentApplications() {
  return authenticatedFetch("/student/applications");
}

export async function withdrawApplication(id: number) {
  return authenticatedFetch(
    `/student/applications/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function getCompanyApplications() {
  return authenticatedFetch("/company/applications");
}

export async function updateCompanyApplicationStatus(
  id: number,
  status: "Applied" | "Under Review" | "Shortlisted" | "Rejected"
) {
  return authenticatedFetch(`/company/applications/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
export async function getCompanyDashboard() {
  return authenticatedFetch("/company/dashboard");
}
export async function getRecommendedCandidates(jobId: number) {
  return authenticatedFetch(`/company/jobs/${jobId}/recommendations`);
}
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