export type UserRole = "student" | "college" | "company";

export interface CareerXUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export function getToken(): string | null {
  return localStorage.getItem("careerx_token");
}

export function getUser(): CareerXUser | null {
  const user = localStorage.getItem("careerx_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("careerx_token");
  localStorage.removeItem("careerx_user");
  localStorage.removeItem("careerx_student");
  localStorage.removeItem("careerx_college");
  localStorage.removeItem("careerx_company");
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "student":
      return "/student/dashboard";

    case "college":
      return "/college/dashboard";

    case "company":
      return "/company/dashboard";

    default:
      return "/";
  }
}