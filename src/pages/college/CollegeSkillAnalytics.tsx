import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

type SkillData = {
  skill: string;
  students: number;
  percentage: number;
  demand: number;
  gap: number;
};

const skills: SkillData[] = [
  {
    skill: "Java",
    students: 486,
    percentage: 78,
    demand: 82,
    gap: 4,
  },
  {
    skill: "Python",
    students: 442,
    percentage: 71,
    demand: 89,
    gap: 18,
  },
  {
    skill: "SQL",
    students: 398,
    percentage: 64,
    demand: 76,
    gap: 12,
  },
  {
    skill: "Data Structures",
    students: 512,
    percentage: 82,
    demand: 91,
    gap: 9,
  },
  {
    skill: "React",
    students: 286,
    percentage: 46,
    demand: 74,
    gap: 28,
  },
  {
    skill: "Machine Learning",
    students: 214,
    percentage: 34,
    demand: 68,
    gap: 34,
  },
  {
    skill: "Node.js",
    students: 198,
    percentage: 32,
    demand: 61,
    gap: 29,
  },
];

const departments = [
  {
    name: "Computer Science",
    students: 486,
    readiness: 88,
    topSkill: "Java",
    skillCoverage: 82,
  },
  {
    name: "Information Technology",
    students: 312,
    readiness: 84,
    topSkill: "Python",
    skillCoverage: 77,
  },
  {
    name: "Electronics & Communication",
    students: 264,
    readiness: 72,
    topSkill: "C",
    skillCoverage: 64,
  },
  {
    name: "Electrical Engineering",
    students: 186,
    readiness: 65,
    topSkill: "C",
    skillCoverage: 58,
  },
];

const skillGaps = [
  {
    skill: "Machine Learning",
    current: 34,
    required: 68,
    gap: 34,
    priority: "High",
  },
  {
    skill: "React",
    current: 46,
    required: 74,
    gap: 28,
    priority: "High",
  },
  {
    skill: "Node.js",
    current: 32,
    required: 61,
    gap: 29,
    priority: "High",
  },
  {
    skill: "Python",
    current: 71,
    required: 89,
    gap: 18,
    priority: "Medium",
  },
  {
    skill: "SQL",
    current: 64,
    required: 76,
    gap: 12,
    priority: "Medium",
  },
];

function CollegeSkillAnalytics() {
  const [department, setDepartment] = useState("All Departments");

  const filteredDepartments = useMemo(() => {
    if (department === "All Departments") {
      return departments;
    }

    return departments.filter((item) => item.name === department);
  }, [department]);

  const averageCoverage = Math.round(
    skills.reduce((sum, item) => sum + item.percentage, 0) /
      skills.length
  );

  const averageDemand = Math.round(
    skills.reduce((sum, item) => sum + item.demand, 0) /
      skills.length
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/college/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-1 text-sm font-semibold text-blue-600">
                Skill Intelligence
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Skill Analytics
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Understand your students' skill strengths, identify industry
                skill gaps and plan targeted upskilling programs.
              </p>
            </div>

            <div className="relative">
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500"
              >
                <option>All Departments</option>
                {departments.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BarChart3 size={21} />
              </div>

              <span className="text-xs font-semibold text-emerald-600">
                +7%
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Average Skill Coverage
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {averageCoverage}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp size={21} />
              </div>

              <span className="text-xs font-semibold text-emerald-600">
                Strong
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Industry Demand
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {averageDemand}%
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle size={21} />
              </div>

              <span className="text-xs font-semibold text-amber-600">
                Action
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Critical Skill Gaps
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              3
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Users size={21} />
              </div>

              <span className="text-xs font-semibold text-violet-600">
                1,248
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Students Analyzed
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              1,248
            </p>
          </div>
        </div>

        {/* Skill Distribution */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Skill Distribution vs Industry Demand
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Compare current student skill coverage against estimated
                industry demand.
              </p>
            </div>

            <div className="hidden items-center gap-5 text-xs text-slate-500 sm:flex">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Student Coverage
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Industry Demand
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {skills.map((item) => (
              <div key={item.skill}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.skill}
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      {item.students} students
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-blue-600">
                      {item.percentage}%
                    </span>

                    <span className="ml-2 text-xs text-slate-400">
                      demand {item.demand}%
                    </span>
                  </div>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-blue-600"
                    style={{ width: `${item.percentage}%` }}
                  />

                  <div
                    className="absolute top-0 h-full border-r-2 border-slate-400"
                    style={{ left: `${item.demand}%` }}
                  />
                </div>

                {item.gap > 20 && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {item.gap}% skill gap detected
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Two Column */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Skill Gap */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Brain size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Priority Skill Gaps
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Skills where industry demand exceeds student coverage.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {skillGaps.map((item) => (
                <div
                  key={item.skill}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.skill}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current {item.current}% • Required {item.required}%
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.priority === "High"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{
                        width: `${Math.min(item.gap * 2.5, 100)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-medium text-red-600">
                    {item.gap}% gap
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                alert("Upskilling program planning will be connected to the backend.")
              }
              className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create Upskilling Plan
            </button>
          </section>

          {/* Department Analytics */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-bold text-slate-900">
                Department Skill Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Compare skill coverage and placement readiness across
                departments.
              </p>
            </div>

            <div className="space-y-4">
              {filteredDepartments.map((department) => (
                <div
                  key={department.name}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {department.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {department.students} students • Top skill:{" "}
                        {department.topSkill}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {department.readiness}%
                      </p>

                      <p className="text-[11px] text-slate-400">
                        readiness
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">
                        Skill Coverage
                      </span>

                      <span className="font-semibold text-slate-700">
                        {department.skillCoverage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${department.skillCoverage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recommendations */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <CheckCircle2 size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Recommended College Action
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Focus upcoming training programs on Machine Learning,
                  React and Node.js. These areas currently show the largest
                  difference between student capability and industry demand.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                alert("Training recommendation saved for the college.")
              }
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Recommendation
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default CollegeSkillAnalytics;
