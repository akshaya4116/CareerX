import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  IndianRupee,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BranchData = {
  branch: string;
  eligible: number;
  placed: number;
};

type CompanyData = {
  company: string;
  students: number;
};

const branchData: BranchData[] = [
  { branch: "CSE", eligible: 420, placed: 370 },
  { branch: "IT", eligible: 310, placed: 265 },
  { branch: "ECE", eligible: 280, placed: 205 },
  { branch: "EEE", eligible: 180, placed: 132 },
];

const companyData: CompanyData[] = [
  { company: "TechNova", students: 58 },
  { company: "DataSphere", students: 46 },
  { company: "CloudWorks", students: 39 },
  { company: "Infosys", students: 34 },
  { company: "TCS", students: 29 },
  { company: "Deloitte", students: 24 },
];

const placementTrend = [
  { year: "2022", rate: 68 },
  { year: "2023", rate: 73 },
  { year: "2024", rate: 76 },
  { year: "2025", rate: 82 },
  { year: "2026", rate: 86 },
];

const packageData = [
  { label: "Highest Package", value: "₹18.5 LPA", icon: Award },
  { label: "Average Package", value: "₹7.8 LPA", icon: IndianRupee },
  { label: "Median Package", value: "₹6.9 LPA", icon: TrendingUp },
];

const pipelineData = [
  {
    label: "Eligible Students",
    value: 1190,
    percentage: 100,
  },
  {
    label: "Students Applied",
    value: 1048,
    percentage: 88,
  },
  {
    label: "Students Shortlisted",
    value: 734,
    percentage: 62,
  },
  {
    label: "Students Placed",
    value: 972,
    percentage: 82,
  },
];

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Users;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BarChart3;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function CollegePlacementAnalytics() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const totalEligible = useMemo(
    () => branchData.reduce((sum, item) => sum + item.eligible, 0),
    [],
  );

  const totalPlaced = useMemo(
    () => branchData.reduce((sum, item) => sum + item.placed, 0),
    [],
  );

  const placementRate = Math.round((totalPlaced / totalEligible) * 100);

  const pieData = [
    { name: "Placed", value: totalPlaced },
    { name: "Not Placed", value: totalEligible - totalPlaced },
  ];

  const branchPerformance = branchData.map((item) => ({
    ...item,
    rate: Math.round((item.placed / item.eligible) * 100),
  }));

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <GraduationCap size={17} />
              College Placement Intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Placement Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor placement performance, recruiting activity, salary
              outcomes and student placement readiness from one dashboard.
            </p>
          </div>

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="2026">Placement Year 2026</option>
              <option value="2025">Placement Year 2025</option>
              <option value="2024">Placement Year 2024</option>
              <option value="2023">Placement Year 2023</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Placement Rate"
            value={`${placementRate}%`}
            subtitle="Students placed successfully"
            icon={Target}
            trend="+4.2% from last year"
          />

          <StatCard
            title="Students Placed"
            value={String(totalPlaced)}
            subtitle={`Out of ${totalEligible} eligible students`}
            icon={CheckCircle2}
            trend="+96 students this year"
          />

          <StatCard
            title="Recruiting Companies"
            value="38"
            subtitle="Companies participating"
            icon={Building2}
            trend="+12 new recruiters"
          />

          <StatCard
            title="Active Offers"
            value="1,124"
            subtitle="Offers received by students"
            icon={BriefcaseBusiness}
            trend="+18.6% from last year"
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Placement Trend */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={TrendingUp}
              title="Placement Rate Trend"
              description="Year-wise improvement in overall placement performance."
            />

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Placement Rate"]}
                  />
                  <Bar
                    dataKey="rate"
                    radius={[8, 8, 0, 0]}
                    fill="#2563eb"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Placement Distribution */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={Users}
              title="Student Placement Distribution"
              description="Current placement status of eligible students."
            />

            <div className="flex h-72 flex-col items-center justify-center sm:flex-row">
              <div className="h-64 w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#2563eb" : "#e2e8f0"}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Placed</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalPlaced}
                  </p>
                  <p className="text-xs font-semibold text-blue-600">
                    {placementRate}% of eligible students
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Remaining</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {totalEligible - totalPlaced}
                  </p>
                  <p className="text-xs text-slate-500">
                    Students still seeking opportunities
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Branch Performance */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={BarChart3}
            title="Branch-wise Placement Performance"
            description="Compare placement outcomes across academic departments."
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Branch
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Eligible
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Placed
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Placement Rate
                  </th>
                  <th className="pb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Performance
                  </th>
                </tr>
              </thead>

              <tbody>
                {branchPerformance.map((item) => (
                  <tr
                    key={item.branch}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-4">
                      <span className="font-semibold text-slate-900">
                        {item.branch}
                      </span>
                    </td>

                    <td className="py-4 text-sm text-slate-600">
                      {item.eligible}
                    </td>

                    <td className="py-4 text-sm font-semibold text-slate-900">
                      {item.placed}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {item.rate}%
                      </span>
                    </td>

                    <td className="w-64 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold text-slate-600">
                          {item.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recruiters + Packages */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Recruiters */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={Building2}
              title="Top Recruiting Companies"
              description="Companies offering the highest number of placements."
            />

            <div className="space-y-4">
              {companyData.map((company, index) => (
                <div
                  key={company.company}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {company.company}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Students placed
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {company.students}
                    </p>
                    <p className="text-xs text-slate-500">placements</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Package Statistics */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={IndianRupee}
              title="Salary Outcomes"
              description="Key compensation metrics for placed students."
            />

            <div className="space-y-4">
              {packageData.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                        <Icon size={20} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <TrendingUp className="text-emerald-500" size={20} />
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex gap-3">
                <Target className="mt-0.5 shrink-0 text-blue-600" size={18} />

                <div>
                  <p className="text-sm font-bold text-blue-900">
                    Placement Insight
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Students with strong DSA, Java, Python and SQL skills are
                    currently showing the highest placement readiness.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Placement Pipeline */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Target}
            title="Placement Pipeline"
            description="Track students through the major stages of the placement journey."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pipelineData.map((item, index) => (
              <div
                key={item.label}
                className="relative rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    STEP {index + 1}
                  </span>

                  {index === pipelineData.length - 1 ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <TrendingUp size={18} className="text-blue-500" />
                  )}
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {item.percentage}% of eligible students
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Attention Section */}
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
                <XCircle size={21} />
              </div>

              <div>
                <h3 className="font-bold text-amber-900">
                  Students requiring placement support
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-amber-800">
                  218 students are currently not placed. Consider targeted
                  skill-development programs, mock interviews and industry
                  preparation for these students.
                </p>
              </div>
            </div>

            <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100">
              View Students
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}