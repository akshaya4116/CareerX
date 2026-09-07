import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

type Company = {
  id: number;
  name: string;
  industry: string;
  location: string;
  status: "Hiring" | "In Discussion" | "Partner";
  jobs: number;
  studentsHired: number;
  lastContact: string;
  skills: string[];
  description: string;
};

const companies: Company[] = [
  {
    id: 1,
    name: "TechNova",
    industry: "Technology",
    location: "Hyderabad",
    status: "Hiring",
    jobs: 6,
    studentsHired: 58,
    lastContact: "2 days ago",
    skills: ["Java", "React", "DSA", "SQL"],
    description:
      "Technology company actively hiring software engineering interns and graduates from the college.",
  },
  {
    id: 2,
    name: "DataSphere",
    industry: "Data & Analytics",
    location: "Bengaluru",
    status: "Hiring",
    jobs: 4,
    studentsHired: 46,
    lastContact: "5 days ago",
    skills: ["Python", "SQL", "ML", "Power BI"],
    description:
      "Data-focused organization looking for students with analytics, Python and machine learning skills.",
  },
  {
    id: 3,
    name: "CloudWorks",
    industry: "Cloud Computing",
    location: "Pune",
    status: "In Discussion",
    jobs: 3,
    studentsHired: 39,
    lastContact: "1 week ago",
    skills: ["AWS", "Node.js", "Docker", "Python"],
    description:
      "Cloud technology company currently discussing a new campus hiring partnership.",
  },
  {
    id: 4,
    name: "Deloitte",
    industry: "Consulting",
    location: "Hyderabad",
    status: "Partner",
    jobs: 5,
    studentsHired: 34,
    lastContact: "2 weeks ago",
    skills: ["Java", "SQL", "Python", "Communication"],
    description:
      "Strategic industry partner offering consulting, technology and analyst opportunities.",
  },
  {
    id: 5,
    name: "Infosys",
    industry: "IT Services",
    location: "Bengaluru",
    status: "Hiring",
    jobs: 7,
    studentsHired: 31,
    lastContact: "3 days ago",
    skills: ["Java", "Python", "SQL", "Cloud"],
    description:
      "Major IT services organization recruiting students across software and technology roles.",
  },
  {
    id: 6,
    name: "FinEdge",
    industry: "FinTech",
    location: "Mumbai",
    status: "In Discussion",
    jobs: 2,
    studentsHired: 18,
    lastContact: "4 days ago",
    skills: ["Java", "React", "SQL", "Finance"],
    description:
      "FinTech company exploring campus recruitment and project collaboration opportunities.",
  },
  {
    id: 7,
    name: "NextGen Systems",
    industry: "Software",
    location: "Chennai",
    status: "Partner",
    jobs: 3,
    studentsHired: 22,
    lastContact: "10 days ago",
    skills: ["C++", "DSA", "Python", "Embedded"],
    description:
      "Software and systems company collaborating with the institution for technical talent.",
  },
  {
    id: 8,
    name: "InnovateLabs",
    industry: "Product Development",
    location: "Hyderabad",
    status: "Hiring",
    jobs: 4,
    studentsHired: 27,
    lastContact: "Yesterday",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    description:
      "Product engineering company looking for full-stack developers and product interns.",
  },
];

const statusStyles = {
  Hiring: "bg-emerald-50 text-emerald-700",
  "In Discussion": "bg-amber-50 text-amber-700",
  Partner: "bg-blue-50 text-blue-700",
};

export default function CollegeCompanies() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase()) ||
        company.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "All" || company.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const hiringCount = companies.filter(
    (company) => company.status === "Hiring",
  ).length;

  const discussionCount = companies.filter(
    (company) => company.status === "In Discussion",
  ).length;

  const totalStudentsHired = companies.reduce(
    (sum, company) => sum + company.studentsHired,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Building2 size={17} />
              Industry Connect
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Companies Approaching Your College
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track companies hiring from your institution, industry
              partnerships, active opportunities and upcoming recruitment
              conversations.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            <Mail size={17} />
            Connect With Company
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Industry Partners
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {companies.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-blue-600">
              Active industry network
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Currently Hiring
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {hiringCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-emerald-600">
              Companies with active roles
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  In Discussion
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {discussionCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-amber-600">
              Potential new partnerships
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Students Hired
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalStudentsHired}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users size={21} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-purple-600">
              Through tracked partners
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies, industries or skills..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Hiring", "In Discussion", "Partner"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Company Cards */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Industry Companies
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredCompanies.length} companies matching your criteria
              </p>
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Building2 className="mx-auto text-slate-300" size={42} />
              <h3 className="mt-4 font-bold text-slate-900">
                No companies found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                      {company.name.charAt(0)}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[company.status]}`}
                    >
                      {company.status}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {company.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {company.industry}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} />
                    {company.location}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Open Roles</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {company.jobs}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Students Hired</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {company.studentsHired}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Skills in demand
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {company.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={14} />
                      {company.lastContact}
                    </span>

                    <button
                      onClick={() => setSelectedCompany(company)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      View details
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Hiring Opportunities */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Star size={21} />
              </div>

              <div>
                <h2 className="font-bold text-blue-900">
                  Strong industry interest detected
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-700">
                  Several companies are actively looking for Java, Python,
                  React, SQL and DSA skills. Use the skill analytics dashboard
                  to prepare students for these opportunities.
                </p>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              View Skill Gaps
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Company Details Modal */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-700">
                  {selectedCompany.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedCompany.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selectedCompany.industry}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompany(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[selectedCompany.status]}`}
              >
                {selectedCompany.status}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {selectedCompany.location}
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              {selectedCompany.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Open Positions</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedCompany.jobs}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Students Hired</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedCompany.studentsHired}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-900">
                Skills Currently in Demand
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCompany.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    Partnership activity
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Last interaction with this company was{" "}
                    {selectedCompany.lastContact}.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedCompany(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  alert(`Connection request sent to ${selectedCompany.name}.`);
                  setSelectedCompany(null);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
