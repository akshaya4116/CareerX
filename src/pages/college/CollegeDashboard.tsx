import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Search,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function CollegeDashboard() {
  const college = JSON.parse(
    localStorage.getItem("careerx_college") || "{}"
  );

  const collegeName = college.collegeName || "Your College";

  const stats = [
    {
      label: "Total Students",
      value: "1,248",
      change: "+12%",
      icon: Users,
    },
    {
      label: "Placement Rate",
      value: "82%",
      change: "+8%",
      icon: TrendingUp,
    },
    {
      label: "Industry Partners",
      value: "38",
      change: "+6",
      icon: Building2,
    },
    {
      label: "Active Opportunities",
      value: "64",
      change: "+14%",
      icon: BriefcaseBusiness,
    },
  ];

  const skillData = [
    { skill: "Java", students: 486, percentage: 78 },
    { skill: "Python", students: 442, percentage: 71 },
    { skill: "SQL", students: 398, percentage: 64 },
    { skill: "React", students: 286, percentage: 46 },
    { skill: "Data Structures", students: 512, percentage: 82 },
  ];

  const companies = [
    {
      name: "TechNova",
      role: "Software Development Intern",
      students: 18,
      status: "Hiring",
    },
    {
      name: "DataSphere",
      role: "Data Analyst",
      students: 12,
      status: "Shortlisting",
    },
    {
      name: "CloudWorks",
      role: "Cloud Engineering Intern",
      students: 9,
      status: "Interviewing",
    },
  ];

  const topStudents = [
    {
      name: "Aarav Sharma",
      branch: "CSE",
      cgpa: "9.2",
      readiness: 94,
      skills: "Java • React • SQL",
    },
    {
      name: "Ananya Reddy",
      branch: "CSE",
      cgpa: "9.0",
      readiness: 91,
      skills: "Python • ML • SQL",
    },
    {
      name: "Rahul Kumar",
      branch: "IT",
      cgpa: "8.9",
      readiness: 88,
      skills: "Java • DSA • React",
    },
    {
      name: "Priya Singh",
      branch: "CSE",
      cgpa: "8.8",
      readiness: 86,
      skills: "Python • Django • SQL",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              College Administration
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {collegeName}
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor student talent, skill gaps, placements and industry
              connections from one dashboard.
            </p>
          </div>

          <Link
            to="/college/students"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Users size={18} />
            Manage Students
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <span className="text-xs font-semibold text-emerald-600">
                    {stat.change}
                  </span>
                </div>

                <p className="text-sm text-slate-500">{stat.label}</p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Skill Distribution */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Student Skill Distribution
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Understand the strongest skills across your students.
                </p>
              </div>

              <Link
                to="/college/skills"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Analytics
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-5">
              {skillData.map((item) => (
                <div key={item.skill}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {item.skill}
                    </span>

                    <span className="text-sm text-slate-500">
                      {item.students} students
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Placement Readiness */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Placement Readiness
                </h2>
                <p className="text-xs text-slate-500">
                  Overall student readiness
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center py-4">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-blue-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">82%</p>
                  <p className="text-xs text-slate-500">Ready</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Placement Ready</span>
                <span className="font-semibold text-slate-900">684</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Needs Improvement</span>
                <span className="font-semibold text-slate-900">342</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Not Ready</span>
                <span className="font-semibold text-slate-900">222</span>
              </div>
            </div>

            <Link
              to="/college/placements"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Placement Analytics
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>

        {/* Companies + Top Students */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Companies */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Industry Connections
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Companies currently engaging with your students.
                </p>
              </div>

              <Link
                to="/college/companies"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <BriefcaseBusiness
                        size={18}
                        className="text-slate-600"
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {company.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {company.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {company.students}
                    </p>

                    <p className="text-xs text-slate-500">
                      {company.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Students */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Top Student Talent
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Students with strong academic and skill profiles.
                </p>
              </div>

              <Link
                to="/college/students"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600"
              >
                Explore
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div
                  key={student.name}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {student.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {student.branch} • CGPA {student.cgpa}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {student.skills}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">
                      {student.readiness}%
                    </p>

                    <p className="text-[11px] text-slate-400">Readiness</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              College Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Access all major CareerX college tools.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Link
              to="/college/students"
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <Users size={20} className="text-blue-600" />
              <p className="mt-3 font-semibold text-slate-900">
                Students
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Manage student talent
              </p>
            </Link>

            <Link
              to="/college/skills"
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <BarChart3 size={20} className="text-blue-600" />
              <p className="mt-3 font-semibold text-slate-900">
                Skill Analytics
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Identify skill gaps
              </p>
            </Link>

            <Link
              to="/college/placements"
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <GraduationCap size={20} className="text-blue-600" />
              <p className="mt-3 font-semibold text-slate-900">
                Placements
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Track placement data
              </p>
            </Link>

            <Link
              to="/college/showcase"
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <Target size={20} className="text-blue-600" />
              <p className="mt-3 font-semibold text-slate-900">
                Showcase
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Highlight achievements
              </p>
            </Link>

            <Link
              to="/college/companies"
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <Search size={20} className="text-blue-600" />
              <p className="mt-3 font-semibold text-slate-900">
                Companies
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Industry connections
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CollegeDashboard;