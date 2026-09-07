import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  Search,
  SlidersHorizontal,
  UserCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

type Student = {
  id: number;
  name: string;
  email: string;
  branch: string;
  year: string;
  cgpa: number;
  readiness: number;
  status: "Placement Ready" | "Preparing" | "Needs Attention";
  skills: string[];
  projects: number;
  certifications: number;
};

const students: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    branch: "CSE",
    year: "Final Year",
    cgpa: 9.2,
    readiness: 94,
    status: "Placement Ready",
    skills: ["Java", "React", "SQL", "DSA"],
    projects: 5,
    certifications: 4,
  },
  {
    id: 2,
    name: "Ananya Reddy",
    email: "ananya.reddy@example.com",
    branch: "CSE",
    year: "Final Year",
    cgpa: 9.0,
    readiness: 91,
    status: "Placement Ready",
    skills: ["Python", "SQL", "Machine Learning"],
    projects: 4,
    certifications: 5,
  },
  {
    id: 3,
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    branch: "IT",
    year: "Final Year",
    cgpa: 8.9,
    readiness: 88,
    status: "Placement Ready",
    skills: ["Java", "DSA", "React", "Git"],
    projects: 4,
    certifications: 3,
  },
  {
    id: 4,
    name: "Priya Singh",
    email: "priya.singh@example.com",
    branch: "CSE",
    year: "Third Year",
    cgpa: 8.8,
    readiness: 86,
    status: "Placement Ready",
    skills: ["Python", "Django", "SQL"],
    projects: 3,
    certifications: 3,
  },
  {
    id: 5,
    name: "Karthik Reddy",
    email: "karthik.reddy@example.com",
    branch: "ECE",
    year: "Final Year",
    cgpa: 8.4,
    readiness: 76,
    status: "Preparing",
    skills: ["C", "Python", "Embedded Systems"],
    projects: 3,
    certifications: 2,
  },
  {
    id: 6,
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    branch: "CSE",
    year: "Third Year",
    cgpa: 8.1,
    readiness: 71,
    status: "Preparing",
    skills: ["JavaScript", "React", "HTML", "CSS"],
    projects: 2,
    certifications: 2,
  },
  {
    id: 7,
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    branch: "EEE",
    year: "Final Year",
    cgpa: 7.8,
    readiness: 62,
    status: "Needs Attention",
    skills: ["C", "Python"],
    projects: 1,
    certifications: 1,
  },
  {
    id: 8,
    name: "Meera Nair",
    email: "meera.nair@example.com",
    branch: "IT",
    year: "Third Year",
    cgpa: 8.6,
    readiness: 82,
    status: "Preparing",
    skills: ["Java", "SQL", "Node.js"],
    projects: 3,
    certifications: 4,
  },
];

function CollegeStudents() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchMatch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        );

      const branchMatch =
        branch === "All" || student.branch === branch;

      const statusMatch =
        status === "All" || student.status === status;

      return searchMatch && branchMatch && statusMatch;
    });
  }, [search, branch, status]);

  const stats = {
    total: students.length,
    ready: students.filter((student) => student.status === "Placement Ready")
      .length,
    preparing: students.filter((student) => student.status === "Preparing")
      .length,
    attention: students.filter(
      (student) => student.status === "Needs Attention"
    ).length,
  };

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

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-1 text-sm font-semibold text-blue-600">
                College Management
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Student Management
              </h1>

              <p className="mt-2 text-slate-500">
                Manage student profiles, skills, academic performance and
                placement readiness.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <GraduationCap size={20} className="text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Total Students</p>
                <p className="font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Students</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Across all departments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Placement Ready</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.ready}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Strong candidate profiles
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Preparing</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {stats.preparing}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Require skill development
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Needs Attention</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {stats.attention}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Require intervention
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students by name, email or skill..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Branch
                </label>

                <select
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option>All</option>
                  <option>CSE</option>
                  <option>IT</option>
                  <option>ECE</option>
                  <option>EEE</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Placement Status
                </label>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option>All</option>
                  <option>Placement Ready</option>
                  <option>Preparing</option>
                  <option>Needs Attention</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Student Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Students
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter size={14} />
              Live filtering
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Branch
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CGPA
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Skills
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Readiness
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                          {student.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <Mail size={12} />
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-700">
                        {student.branch}
                      </p>
                      <p className="text-xs text-slate-400">
                        {student.year}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-900">
                        {student.cgpa}
                      </span>
                    </td>

                    <td className="max-w-[220px] px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}

                        {student.skills.length > 3 && (
                          <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                            +{student.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="w-28">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold text-slate-700">
                            {student.readiness}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              student.readiness >= 85
                                ? "bg-emerald-500"
                                : student.readiness >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${student.readiness}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          student.status === "Placement Ready"
                            ? "bg-emerald-50 text-emerald-700"
                            : student.status === "Preparing"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="px-6 py-16 text-center">
              <Search
                size={32}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                No students found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Student Profile
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedStudent.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  {selectedStudent.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedStudent.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedStudent.email}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedStudent.branch} • {selectedStudent.year}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedStudent.status === "Placement Ready"
                      ? "bg-emerald-50 text-emerald-700"
                      : selectedStudent.status === "Preparing"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">CGPA</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedStudent.cgpa}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Readiness</p>
                  <p className="mt-1 text-2xl font-bold text-blue-600">
                    {selectedStudent.readiness}%
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Projects</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedStudent.projects}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-900">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    Completed Projects
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {selectedStudent.projects}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    Certifications
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {selectedStudent.certifications}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    alert(`Student profile for ${selectedStudent.name}`)
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <UserCheck size={17} />
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeStudents;
