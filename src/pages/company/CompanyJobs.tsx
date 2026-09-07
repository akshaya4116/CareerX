import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
  XCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteJob,
  getJobs,
  updateJob,
} from "../../services/api";

type Job = {
  id: number;
  company: string;
  title: string;
  type: "Internship" | "Full-time";
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  salary: string;
  deadline: string;
  description: string;
  eligibility: string;
  skills: string[];
  status: "Active" | "Closed";
  applicants: number;
  created_at?: string;
  createdAt?: string;
};

function CompanyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Closed"
  >("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const normalizeJob = (item: any): Job => {
    const skills = Array.isArray(item.skills)
      ? item.skills
          .map((skill: unknown) => String(skill).trim())
          .filter(Boolean)
      : typeof item.skills === "string"
        ? item.skills
            .split(",")
            .map((skill: string) => skill.trim())
            .filter(Boolean)
        : [];

    return {
      id: Number(item.id),
      company:
        item.company ||
        item.company_name ||
        item.companyName ||
        "Company",
      title: item.title || "",
      type: item.type === "Full-time" ? "Full-time" : "Internship",
      location: item.location || "Not specified",
      mode:
        item.mode === "Remote" ||
        item.mode === "Hybrid" ||
        item.mode === "On-site"
          ? item.mode
          : "On-site",
      salary: item.salary || "Not specified",
      deadline: item.deadline || "",
      description: item.description || "",
      eligibility: item.eligibility || "",
      skills,
      status: item.status === "Closed" ? "Closed" : "Active",
      applicants: Number(
        item.applicants || item.application_count || 0
      ),
      created_at: item.created_at,
      createdAt: item.createdAt,
    };
  };

  const loadJobs = async () => {
    try {
      setLoading(true);

      const data = await getJobs();

      const normalized = Array.isArray(data)
        ? data.map(normalizeJob)
        : [];

      setJobs(normalized);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const activeCount = jobs.filter(
    (job) => job.status === "Active"
  ).length;

  const closedCount = jobs.filter(
    (job) => job.status === "Closed"
  ).length;

  const totalApplicants = jobs.reduce(
    (total, job) => total + Number(job.applicants || 0),
    0
  );

  const handleToggleStatus = async (job: Job) => {
    try {
      setActionLoading(job.id);

      await updateJob(job.id, {
        status: job.status === "Active" ? "Closed" : "Active",
      });

      await loadJobs();

      if (selectedJob?.id === job.id) {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Failed to update job status:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update job status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this job?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(jobId);

      await deleteJob(jobId);

      setSelectedJob(null);

      await loadJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete job."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return "No deadline";

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <button
            onClick={() => navigate("/company/dashboard")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Hiring Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Job Opportunities
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Manage your active opportunities and connect with talented
                students.
              </p>
            </div>

            <button
              onClick={() => navigate("/company/jobs/new")}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Post New Job
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Jobs"
            value={jobs.length}
            icon={<BriefcaseBusiness size={20} />}
          />

          <StatCard
            label="Active Jobs"
            value={activeCount}
            icon={<CheckCircle2 size={20} />}
          />

          <StatCard
            label="Closed Jobs"
            value={closedCount}
            icon={<XCircle size={20} />}
          />

          <StatCard
            label="Total Applicants"
            value={totalApplicants}
            icon={<Users size={20} />}
          />
        </div>

        {/* Search / Filter */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, skills or locations..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "All"
                    | "Active"
                    | "Closed"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="All">All Jobs</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading your jobs...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white py-20 text-center">
            <BriefcaseBusiness
              size={42}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-900">
              No jobs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {jobs.length === 0
                ? "You haven't posted any jobs yet."
                : "Try changing your search or filter."}
            </p>

            {jobs.length === 0 && (
              <button
                onClick={() => navigate("/company/jobs/new")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={18} />
                Post Your First Job
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {filteredJobs.map((job, jobIndex) => (
              <div
                key={`job-${job.id}-${jobIndex}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BriefcaseBusiness size={23} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      job.status === "Active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={16} />
                    {job.type}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {job.location || "Not specified"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={16} />
                    {job.mode}
                  </span>
                </div>

                {/* Salary */}
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Salary / Stipend
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {job.salary || "Not specified"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        Deadline
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <CalendarDays size={15} />
                        {formatDeadline(job.deadline)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={`job-${job.id}-skill-${skillIndex}`}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {job.applicants} applicants
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* View Details */}
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Details
                    </button>

                    {/* Applications */}
                    <button
                      onClick={() =>
                        navigate(
                          `/company/applications?job=${job.id}`
                        )
                      }
                      className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Applications
                    </button>

                    {/* Smart Candidates */}
                    <button
                      onClick={() =>
                        navigate(
                          `/company/candidates?job=${job.id}`
                        )
                      }
                      disabled={job.status === "Closed"}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      Smart Candidates
                    </button>

                    {/* Close / Reopen */}
                    <button
                      onClick={() => handleToggleStatus(job)}
                      disabled={actionLoading === job.id}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                        job.status === "Active"
                          ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {actionLoading === job.id
                        ? "Updating..."
                        : job.status === "Active"
                          ? "Close"
                          : "Reopen"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={actionLoading === job.id}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      title="Delete job"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness size={27} />
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        selectedJob.status === "Active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {selectedJob.status}
                    </span>

                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      {selectedJob.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {selectedJob.company}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <DetailBox
                  label="Type"
                  value={selectedJob.type}
                />

                <DetailBox
                  label="Location"
                  value={selectedJob.location}
                />

                <DetailBox
                  label="Work Mode"
                  value={selectedJob.mode}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailBox
                  label="Salary / Stipend"
                  value={selectedJob.salary || "Not specified"}
                />

                <DetailBox
                  label="Application Deadline"
                  value={formatDeadline(selectedJob.deadline)}
                />
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  About the Role
                </h3>

                <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                  {selectedJob.description || "No description provided."}
                </p>
              </div>

              {selectedJob.skills.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">
                    Required Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, skillIndex) => (
                      <span
                        key={`modal-${selectedJob.id}-skill-${skillIndex}`}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.eligibility && (
                <div>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Eligibility
                  </h3>

                  <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                    {selectedJob.eligibility}
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Applications Received
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      Students who have applied to this opportunity
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-blue-700">
                    {selectedJob.applicants}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                <button
                  onClick={() => {
                    const id = selectedJob.id;
                    setSelectedJob(null);

                    navigate(`/company/applications?job=${id}`);
                  }}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Applications
                </button>

                <button
                  onClick={() => {
                    const id = selectedJob.id;
                    setSelectedJob(null);

                    navigate(`/company/candidates?job=${id}`);
                  }}
                  disabled={selectedJob.status === "Closed"}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles size={17} />
                  Smart Candidates
                </button>

                <button
                  onClick={() => handleToggleStatus(selectedJob)}
                  disabled={actionLoading === selectedJob.id}
                  className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  {actionLoading === selectedJob.id
                    ? "Updating..."
                    : selectedJob.status === "Active"
                      ? "Close Job"
                      : "Reopen Job"}
                </button>

                <button
                  onClick={() => handleDeleteJob(selectedJob.id)}
                  disabled={actionLoading === selectedJob.id}
                  className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Trash2 size={17} />
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default CompanyJobs;