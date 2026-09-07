import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getStudentProfile,
  getStudentSkills,
  getStudentProjects,
} from "../../services/api";

type Profile = {
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  course?: string;
  branch?: string;
  graduationYear?: string | number;
  location?: string;
  bio?: string;
  cgpa?: string | number;
};

type Skill = {
  id?: number;
  name?: string;
  skill_name?: string;
  proficiency?: number;
  level?: string;
};

type Project = {
  id?: number;
  title?: string;
  description?: string;
  technologies?: string | string[];
  github_url?: string;
  demo_url?: string;
  type?: string;
  status?: string;
};

// function getValue(value: unknown): string {
//   if (value === null || value === undefined) return "";
//   return String(value);
// }

function getSkillName(skill: Skill): string {
  return skill.name || skill.skill_name || "";
}

function getTechnologies(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function SectionTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mb-4 border-b-2 border-slate-900 pb-2">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
        {children}
      </h2>
    </div>
  );
}

function SkillBar({
  name,
  proficiency,
}: {
  name: string;
  proficiency: number;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">
          {name}
        </span>

        <span className="text-xs font-semibold text-slate-500">
          {proficiency}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: `${Math.min(Math.max(proficiency, 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function StudentResume() {
  const [profile, setProfile] = useState<Profile>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResume();
  }, []);

  async function loadResume() {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, skillsResponse, projectsResponse] =
        await Promise.all([
          getStudentProfile(),
          getStudentSkills(),
          getStudentProjects(),
        ]);

      const profileData =
        profileResponse?.profile ||
        profileResponse?.student ||
        profileResponse ||
        {};

      const skillsData =
        skillsResponse?.skills ||
        skillsResponse?.data ||
        [];

      const projectsData =
        projectsResponse?.projects ||
        projectsResponse?.data ||
        [];

      setProfile(profileData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error("Resume loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load resume data."
      );
    } finally {
      setLoading(false);
    }
  }

  const sortedSkills = useMemo(() => {
    return [...skills]
      .filter((skill) => getSkillName(skill))
      .sort(
        (a, b) =>
          Number(b.proficiency || 0) -
          Number(a.proficiency || 0)
      );
  }, [skills]);

  const initials = useMemo(() => {
    const name = profile.fullName?.trim();

    if (!name) return "S";

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile.fullName]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Building your resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Loading your profile, skills and projects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
              !
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              Could not load your resume
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadResume}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          html,
          body {
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .resume-page {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
          }

          .resume-container {
            padding-top: 0 !important;
          }

          .resume-section {
            break-inside: avoid;
          }

          .project-item {
            break-inside: avoid;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>

      <div className="resume-container min-h-screen bg-slate-50 pt-20">
        {/* Toolbar */}
        <div className="no-print sticky top-20 z-40 border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                My Resume
              </h1>

              <p className="text-sm text-slate-500">
                Professional resume generated from your CareerX profile
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadResume}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>

              <button
                onClick={handlePrint}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Download / Print
              </button>
            </div>
          </div>
        </div>

        {/* Resume */}
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="resume-page mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {/* Header */}
            <header className="border-b-4 border-blue-600 px-10 py-8">
              <div className="flex items-start justify-between gap-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {initials}
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                      {profile.fullName || "Your Name"}
                    </h1>

                    <p className="mt-1 text-base font-medium text-blue-600">
                      {profile.branch ||
                        profile.course ||
                        "Computer Science Student"}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      {profile.email && (
                        <div>{profile.email}</div>
                      )}

                      {profile.phone && (
                        <div>{profile.phone}</div>
                      )}

                      {profile.location && (
                        <div>{profile.location}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  {profile.college && (
                    <p className="max-w-[220px] text-sm font-semibold text-slate-800">
                      {profile.college}
                    </p>
                  )}

                  {profile.graduationYear && (
                    <p className="mt-1 text-sm text-slate-500">
                      Expected Graduation:{" "}
                      {profile.graduationYear}
                    </p>
                  )}

                  {profile.cgpa && (
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      CGPA: {profile.cgpa}
                    </p>
                  )}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-8 px-10 py-8 md:grid-cols-[1fr_260px]">
              {/* Main column */}
              <div>
                {/* Summary */}
                <section className="resume-section mb-8">
                  <SectionTitle>Professional Summary</SectionTitle>

                  <p className="text-sm leading-7 text-slate-600">
                    {profile.bio ||
                      `Motivated ${
                        profile.branch || "Computer Science"
                      } student with a strong interest in software development,
                      problem solving and building technology-driven solutions.
                      Seeking opportunities to apply technical skills, gain
                      industry experience and contribute to meaningful projects.`}
                  </p>
                </section>

                {/* Education */}
                <section className="resume-section mb-8">
                  <SectionTitle>Education</SectionTitle>

                  <div className="relative border-l-2 border-slate-200 pl-5">
                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-blue-600" />

                    <h3 className="text-base font-bold text-slate-900">
                      {profile.course ||
                        "Bachelor of Technology / Engineering"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {profile.college || "College Name"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      {profile.branch && (
                        <span>
                          Branch: {profile.branch}
                        </span>
                      )}

                      {profile.graduationYear && (
                        <span>
                          Graduation: {profile.graduationYear}
                        </span>
                      )}

                      {profile.cgpa && (
                        <span>
                          CGPA: {profile.cgpa}
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Projects */}
                <section className="resume-section mb-8">
                  <SectionTitle>Projects</SectionTitle>

                  {projects.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No projects added yet. Add projects from your
                      Projects section to display them here.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((project, index) => {
                        const technologies = getTechnologies(
                          project.technologies
                        );

                        return (
                          <div
                            key={
                              project.id ??
                              `${project.title}-${index}`
                            }
                            className="project-item"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-base font-bold text-slate-900">
                                  {project.title ||
                                    "Untitled Project"}
                                </h3>

                                {project.type && (
                                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    {project.type}
                                  </p>
                                )}
                              </div>

                              <div className="flex shrink-0 gap-3 text-xs">
                                {project.github_url && (
                                  <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-blue-600 hover:underline"
                                  >
                                    GitHub
                                  </a>
                                )}

                                {project.demo_url && (
                                  <a
                                    href={project.demo_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-blue-600 hover:underline"
                                  >
                                    Live Demo
                                  </a>
                                )}
                              </div>
                            </div>

                            {project.description && (
                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {project.description}
                              </p>
                            )}

                            {technologies.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {technologies.map((technology) => (
                                  <span
                                    key={technology}
                                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                                  >
                                    {technology}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <aside>
                {/* Skills */}
                <section className="resume-section mb-8">
                  <SectionTitle>Technical Skills</SectionTitle>

                  {sortedSkills.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No skills added yet.
                    </p>
                  ) : (
                    <div>
                      {sortedSkills.map((skill, index) => (
                        <SkillBar
                          key={
                            skill.id ??
                            `${getSkillName(skill)}-${index}`
                          }
                          name={getSkillName(skill)}
                          proficiency={Number(
                            skill.proficiency || 0
                          )}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Academic Info */}
                <section className="resume-section mb-8">
                  <SectionTitle>Academic Details</SectionTitle>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        College
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {profile.college || "Not added"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Course
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {profile.course || "Not added"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Branch
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {profile.branch || "Not added"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Graduation Year
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {profile.graduationYear || "Not added"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        CGPA
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {profile.cgpa || "Not added"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* CareerX */}
                <section className="resume-section rounded-xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                    CareerX Profile
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Skills, projects and academic information are
                    synchronized from your CareerX profile.
                  </p>
                </section>
              </aside>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-slate-50 px-10 py-4 text-center">
              <p className="text-xs text-slate-400">
                Generated using CareerX • Academia • Skills • Industry
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}