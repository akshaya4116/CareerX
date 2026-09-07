import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Plus,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const studentData = JSON.parse(
  localStorage.getItem("careerx_student") || "{}"
);

const studentName = studentData.fullName || "Student";
const studentCollege = studentData.college || "Your College";

  const skills = [
    { name: "Java", level: 85 },
    { name: "Python", level: 78 },
    { name: "SQL", level: 72 },
    { name: "React", level: 65 },
  ];

  const opportunities = [
    {
      company: "TechNova",
      role: "Software Development Intern",
      type: "Internship",
      location: "Hyderabad",
      match: 92,
    },
    {
      company: "DataSphere",
      role: "Junior Data Analyst",
      type: "Job",
      location: "Remote",
      match: 86,
    },
    {
      company: "CloudWorks",
      role: "Cloud Engineering Intern",
      type: "Internship",
      location: "Bangalore",
      match: 79,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Welcome */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Student Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
             Welcome back, {studentName} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {studentCollege} • Track your skills, discover opportunities and improve
               your placement readiness.
            </p>
          </div>

          <button
            onClick={() => navigate("/student/profile")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <UserRound size={17} />
            Complete Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Profile Completion"
            value="78%"
            icon={UserRound}
            subtitle="Keep improving your profile"
          />

          <StatCard
            title="Placement Readiness"
            value="82%"
            icon={Target}
            subtitle="+8% from last month"
          />

          <StatCard
            title="Skill Match"
            value="87%"
            icon={TrendingUp}
            subtitle="Based on your skills"
          />

          <StatCard
            title="Opportunities"
            value="24"
            icon={BriefcaseBusiness}
            subtitle="12 new this week"
          />

        </div>

        {/* Main grid */}
        <div className="mt-7 grid gap-7 lg:grid-cols-3">

          {/* Skills */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Skills
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track and improve your technical skills.
                </p>
              </div>

              <button
                onClick={() => navigate("/student/skills")}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Manage
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {skills.map((skill) => (
                <div key={skill.name}>

                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {skill.name}
                    </span>

                    <span className="font-semibold text-slate-500">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/student/skills")}
              className="mt-7 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <Plus size={16} />
              Add Skill
            </button>

          </section>

          {/* Readiness */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Placement Readiness
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your current career preparation level.
            </p>

            <div className="mt-7 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-blue-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">82%</p>
                  <p className="text-xs font-medium text-slate-500">
                    Ready
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 space-y-3">

              <ReadinessItem
                label="Profile"
                completed
              />

              <ReadinessItem
                label="Skills"
                completed
              />

              <ReadinessItem
                label="Projects"
                completed
              />

              <ReadinessItem
                label="Certifications"
                completed={false}
              />

            </div>

          </section>
        </div>

        {/* Opportunities */}
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended Opportunities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Opportunities matching your current skills.
              </p>
            </div>

            <button
              onClick={() => navigate("/student/opportunities")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all opportunities →
            </button>

          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            {opportunities.map((opportunity) => (
              <div
                key={opportunity.role}
                className="rounded-xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness size={21} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    {opportunity.match}% match
                  </span>

                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {opportunity.company}
                </p>

                <h3 className="mt-1 font-bold text-slate-900">
                  {opportunity.role}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {opportunity.type} • {opportunity.location}
                </p>

                <button
                  onClick={() => navigate("/student/opportunities")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  View Opportunity
                  <ArrowUpRight size={15} />
                </button>

              </div>
            ))}

          </div>

        </section>

        {/* Quick Actions */}
        <section className="mt-7">

          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              icon={UserRound}
              title="Edit Profile"
              description="Update your information"
              onClick={() => navigate("/student/profile")}
            />

            <QuickAction
              icon={Plus}
              title="Add Project"
              description="Showcase your work"
              onClick={() => navigate("/student/projects")}
            />

            <QuickAction
              icon={FileText}
              title="Resume"
              description="Manage your resume"
              onClick={() => navigate("/student/resume")}
            />

            <QuickAction
              icon={BriefcaseBusiness}
              title="Applications"
              description="Track your applications"
              onClick={() => navigate("/student/applications")}
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

      </div>

      <p className="mt-3 text-xs text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}

function ReadinessItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2
        size={18}
        className={completed ? "text-blue-600" : "text-slate-300"}
      />

      <span
        className={
          completed
            ? "text-sm font-medium text-slate-700"
            : "text-sm text-slate-400"
        }
      >
        {label}
      </span>

      <span className="ml-auto text-xs text-slate-400">
        {completed ? "Complete" : "Pending"}
      </span>

    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>

      <div>
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}

export default StudentDashboard;