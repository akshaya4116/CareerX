import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getJobs, applyForJob, getStudentApplications } from "../../services/api";

type Job = {
  id: number;
  company: string;
  title: string;
  type: "Internship" | "Full-time";
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  salary: string;
  posted: string;
  deadline: string;
  description: string;
  skills: string[];
  match: number;
  applicants: number;
};

function normalizeJob(item: unknown): Job {
  const job = item as Record<string, unknown>;

  const rawSkills = job.skills;

  let skills: string[] = [];

  if (Array.isArray(rawSkills)) {
    skills = rawSkills.map((skill) => String(skill).trim()).filter(Boolean);
  } else if (typeof rawSkills === "string") {
    skills = rawSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  const rawType = String(job.type ?? "Internship");
  const rawMode = String(job.mode ?? "On-site");

  return {
    id: Number(job.id),
    company: String(
      job.company ??
        job.companyName ??
        job.company_name ??
        "Company"
    ),
    title: String(job.title ?? "Job Opportunity"),
    type:
      rawType === "Full-time"
        ? "Full-time"
        : "Internship",
    location: String(job.location ?? "Location not specified"),
    mode:
      rawMode === "Remote" ||
      rawMode === "Hybrid" ||
      rawMode === "On-site"
        ? rawMode
        : "On-site",
    salary: String(job.salary ?? "Not specified"),
    posted: String(
      job.posted ??
        job.created_at ??
        "Recently posted"
    ),
    deadline: String(job.deadline ?? "Not specified"),
    description: String(
      job.description ?? "No description available."
    ),
    skills,
    match: Number(job.match ?? 0),
    applicants: Number(job.applicants ?? 0),
  };
}

function calculatePostedDate(value: string) {
  if (!value) return "Recently posted";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const difference =
    now.getTime() - date.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);

  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

function normalizeLoadedJob(item: unknown): Job {
  const job = normalizeJob(item);

  return {
    ...job,
    posted: calculatePostedDate(job.posted),
  };
}

function StudentOpportunities() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs();

      if (!Array.isArray(data)) {
        setJobs([]);
        return;
      }

      const normalizedJobs = data
        .map(normalizeLoadedJob)
        .filter((job) => Number.isFinite(job.id));

      setJobs(normalizedJobs);
    } catch (err) {
      console.error("Failed to load jobs:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load opportunities."
      );

      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications() {
    try {
      const data = await getStudentApplications();

      if (!Array.isArray(data)) {
        setAppliedJobs([]);
        return;
      }

      const ids = data
        .map((application: unknown) => {
          const item =
            application as Record<string, unknown>;

          return Number(
            item.jobId ?? item.job_id
          );
        })
        .filter((id) => Number.isFinite(id));

      setAppliedJobs(ids);
    } catch (err) {
      console.error(
        "Failed to load student applications:",
        err
      );

      /*
       * Backend applications are the source of truth.
       * If loading fails, we don't mark jobs as applied.
       */
      setAppliedJobs([]);
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesType =
        typeFilter === "All" ||
        job.type === typeFilter;

      const matchesMode =
        modeFilter === "All" ||
        job.mode === modeFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesMode
      );
    });
  }, [jobs, search, typeFilter, modeFilter]);

  const toggleSave = (id: number) => {
    setSavedJobs((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id]
    );
  };

  const applyToJob = async (id: number) => {
    if (applying) return;

    if (appliedJobs.includes(id)) {
      alert("You have already applied for this opportunity.");
      return;
    }

    try {
      setApplying(true);

      await applyForJob(id);

      setAppliedJobs((current) =>
        current.includes(id)
          ? current
          : [...current, id]
      );

      alert("Application submitted successfully!");

      setSelectedJob(null);
    } catch (err) {
      console.error("Application error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit application.";

      alert(message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <button
            onClick={() =>
              navigate("/student/dashboard")
            }
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Career Opportunities
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Find your next opportunity
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Discover internships and jobs matched to your skills,
                interests and career goals.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="rounded-lg bg-blue-600 p-2 text-white">
                <TargetIcon />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Your profile match
                </p>

                <p className="text-lg font-bold text-blue-700">
                  87%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search jobs, companies or skills..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <SlidersHorizontal size={18} />

                <span className="hidden text-sm font-medium sm:block">
                  Filters
                </span>
              </div>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Types</option>
                <option value="Internship">
                  Internship
                </option>
                <option value="Full-time">
                  Full-time
                </option>
              </select>

              <select
                value={modeFilter}
                onChange={(e) =>
                  setModeFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Opportunities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading opportunities..."
                : `${filteredJobs.length} opportunities found`}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <CheckCircle2
              size={17}
              className="text-emerald-500"
            />
            Ranked by skill match
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h3 className="text-lg font-semibold text-slate-900">
              Loading opportunities
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching the latest jobs from CareerX.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white py-16 text-center">
            <h3 className="text-lg font-semibold text-red-700">
              Unable to load opportunities
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadJobs}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <Search
              size={40}
              className="mx-auto mb-4 text-slate-300"
            />

            <h3 className="text-lg font-semibold text-slate-900">
              No opportunities found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                {/* Company + Save */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 size={23} />
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

                  <button
                    onClick={() =>
                      toggleSave(job.id)
                    }
                    className={`rounded-lg p-2 transition ${
                      savedJobs.includes(job.id)
                        ? "bg-amber-50 text-amber-500"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    }`}
                    title="Save opportunity"
                  >
                    <Star
                      size={20}
                      fill={
                        savedJobs.includes(job.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* Match */}
                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-800">
                      Skill Match
                    </span>

                    <span className="text-lg font-bold text-emerald-700">
                      {job.match}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${job.match}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-emerald-700">
                    Strong match based on your current skills
                  </p>
                </div>

                {/* Details */}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={16} />
                    {job.type}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={16} />
                    {job.mode}
                  </span>
                </div>

                {/* Skills */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Required Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {job.posted}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {job.applicants} applicants
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedJob(job)
                    }
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={27} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedJob.title}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {selectedJob.company}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedJob(null)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

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
                  label="Salary"
                  value={selectedJob.salary}
                />
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-slate-900">
                  About the role
                </h3>

                <p className="text-sm leading-6 text-slate-600">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-slate-900">
                  Required skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Your Skill Match
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      Based on your CareerX skill profile
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-emerald-700">
                    {selectedJob.match}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-400">
                    Application deadline
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedJob.deadline}
                  </p>
                </div>

                <button
                  onClick={() =>
                    applyToJob(selectedJob.id)
                  }
                  disabled={
                    appliedJobs.includes(
                      selectedJob.id
                    ) || applying
                  }
                  className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
                    appliedJobs.includes(
                      selectedJob.id
                    )
                      ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                      : applying
                        ? "cursor-wait bg-blue-400 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {appliedJobs.includes(
                    selectedJob.id
                  )
                    ? "Application Submitted"
                    : applying
                      ? "Submitting..."
                      : "Apply Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

function TargetIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export default StudentOpportunities;