import { useEffect, useMemo, useState } from "react";
import {
  getCompanyApplications,
  updateCompanyApplicationStatus,
} from "../../services/api";

type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected";

type Application = {
  id: string;
  jobId?: string;
  candidateId?: string;
  candidate: string;
  email: string;
  role: string;
  college: string;
  branch: string;
  cgpa: number;
  readiness: number;
  type: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
};

function getStatusClass(status: ApplicationStatus) {
  switch (status) {
    case "Shortlisted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

function formatDate(date: string) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeApplication(
  item: unknown,
  index: number
): Application {
  const app = item as Record<string, unknown>;

  const status: ApplicationStatus =
    app.status === "Shortlisted" ||
    app.status === "Under Review" ||
    app.status === "Rejected"
      ? app.status
      : "Applied";

  return {
    id: String(app.id ?? `application-${index}`),

    jobId:
      app.job_id !== undefined && app.job_id !== null
        ? String(app.job_id)
        : undefined,

    candidateId:
      app.student_id !== undefined && app.student_id !== null
        ? String(app.student_id)
        : undefined,

    candidate: String(
      app.student_name ??
        app.candidate ??
        app.name ??
        "Student"
    ),

    email: String(
      app.student_email ??
        app.email ??
        ""
    ),

    role: String(
      app.title ??
        app.role ??
        "Job Opportunity"
    ),

    college: String(
      app.college ??
        "College not specified"
    ),

    branch: String(
      app.branch ??
        "Not specified"
    ),

    cgpa: Number(app.cgpa ?? 0),

    readiness: Number(
      app.readiness ?? 0
    ),

    type: String(
      app.type ??
        "Job"
    ),

    location: String(
      app.location ??
        app.mode ??
        "Location not specified"
    ),

    appliedDate: String(
      app.applied_at ??
        app.appliedDate ??
        app.createdAt ??
        ""
    ),

    status,
  };
}

export default function CompanyApplications() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [filter, setFilter] =
    useState<"All" | ApplicationStatus>("All");

  const [search, setSearch] =
    useState("");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyApplications();

      const normalized = Array.isArray(data)
        ? data.map(normalizeApplication)
        : [];

      setApplications(normalized);
    } catch (err) {
      console.error(
        "Failed to load company applications:",
        err
      );

      setError(
        "Unable to load applications. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(
    applicationId: string,
    status: ApplicationStatus
  ) {
    const numericId = Number(applicationId);

    if (!Number.isFinite(numericId)) {
      alert("Invalid application ID.");
      return;
    }

    try {
      setUpdatingId(numericId);
      setError("");

      await updateCompanyApplicationStatus(
        numericId,
        status
      );

      // Update the page immediately
      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      // Also update the selected modal application
      setSelectedApplication((current) =>
        current && current.id === applicationId
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error(
        "Failed to update application status:",
        err
      );

      alert(
        "Failed to update application status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesFilter =
        filter === "All" ||
        application.status === filter;

      const matchesSearch =
        !query ||
        application.candidate
          .toLowerCase()
          .includes(query) ||
        application.email
          .toLowerCase()
          .includes(query) ||
        application.role
          .toLowerCase()
          .includes(query) ||
        application.college
          .toLowerCase()
          .includes(query) ||
        application.branch
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, search]);

  const stats = useMemo(() => {
    return {
      total: applications.length,

      review: applications.filter(
        (item) =>
          item.status === "Under Review"
      ).length,

      shortlisted: applications.filter(
        (item) =>
          item.status === "Shortlisted"
      ).length,

      rejected: applications.filter(
        (item) =>
          item.status === "Rejected"
      ).length,
    };
  }, [applications]);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Applications
              </h1>

              <p className="mt-2 text-slate-500">
                Review and manage candidates who applied
                to your opportunities.
              </p>
            </div>

            <button
              onClick={loadApplications}
              disabled={loading}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Refreshing..."
                : "Refresh Applications"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Under Review
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {stats.review}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Shortlisted
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.shortlisted}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {stats.rejected}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "All",
                  "Applied",
                  "Under Review",
                  "Shortlisted",
                  "Rejected",
                ] as const
              ).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    filter === item
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search candidates..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-80"
            />

          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading applications...
            </p>
          </div>

        ) : filteredApplications.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📄
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {applications.length === 0
                ? "Applications from students will appear here when they apply to your jobs."
                : "Try changing your filters or search query."}
            </p>
          </div>

        ) : (

          /* Applications */
          <div className="space-y-4">
            {filteredApplications.map(
              (application) => {

                const isUpdating =
                  updatingId === Number(application.id);

                return (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Candidate */}
                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                          {application.candidate
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {application.candidate}
                          </h2>

                          <p className="mt-1 font-medium text-blue-600">
                            {application.role}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                            <span>
                              {application.college}
                            </span>

                            <span>•</span>

                            <span>
                              {application.branch}
                            </span>

                            {application.cgpa > 0 && (
                              <>
                                <span>•</span>

                                <span>
                                  CGPA {application.cgpa}
                                </span>
                              </>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-500">
                            {application.email}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                        <button
                          onClick={() =>
                            setSelectedApplication(
                              application
                            )
                          }
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View Candidate
                        </button>

                      </div>
                    </div>

                    {/* Candidate metrics */}
                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Readiness
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    application.readiness,
                                    0
                                  ),
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-sm font-bold text-slate-700">
                            {application.readiness}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          CGPA
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {application.cgpa > 0
                            ? application.cgpa
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Applied On
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(
                            application.appliedDate
                          )}
                        </p>
                      </div>

                    </div>

                    {/* Application progress */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>
                          Application Progress
                        </span>

                        <span>
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-3 flex gap-2">

                        <div
                          className={`h-2 flex-1 rounded-full ${
                            application.status !==
                            "Rejected"
                              ? "bg-blue-600"
                              : "bg-red-400"
                          }`}
                        />

                        <div
                          className={`h-2 flex-1 rounded-full ${
                            [
                              "Under Review",
                              "Shortlisted",
                            ].includes(
                              application.status
                            )
                              ? "bg-blue-600"
                              : "bg-slate-200"
                          }`}
                        />

                        <div
                          className={`h-2 flex-1 rounded-full ${
                            application.status ===
                            "Shortlisted"
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />

                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            "Under Review"
                          )
                        }
                        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating &&
                        application.status !==
                          "Under Review"
                          ? "Updating..."
                          : "Review"}
                      </button>

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            "Shortlisted"
                          )
                        }
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating &&
                        application.status !==
                          "Shortlisted"
                          ? "Updating..."
                          : "Shortlist"}
                      </button>

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            "Rejected"
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isUpdating &&
                        application.status !==
                          "Rejected"
                          ? "Updating..."
                          : "Reject"}
                      </button>

                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

      </main>

      {/* Candidate Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-6"
          onClick={() =>
            setSelectedApplication(null)
          }
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Candidate Application
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedApplication.candidate}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedApplication.email}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Candidate Details */}
            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applied For
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedApplication.role}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  College
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedApplication.college}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Branch
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedApplication.branch}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    CGPA
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedApplication.cgpa > 0
                      ? selectedApplication.cgpa
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Readiness
                  </p>

                  <p className="mt-1 font-semibold text-blue-600">
                    {selectedApplication.readiness}%
                  </p>
                </div>

              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Applied On
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatDate(
                    selectedApplication.appliedDate
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                    selectedApplication.status
                  )}`}
                >
                  {selectedApplication.status}
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="mt-7 space-y-3">

              <div className="grid grid-cols-3 gap-2">

                <button
                  disabled={
                    updatingId ===
                    Number(selectedApplication.id)
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      selectedApplication.id,
                      "Under Review"
                    )
                  }
                  className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Review
                </button>

                <button
                  disabled={
                    updatingId ===
                    Number(selectedApplication.id)
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      selectedApplication.id,
                      "Shortlisted"
                    )
                  }
                  className="rounded-lg bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Shortlist
                </button>

                <button
                  disabled={
                    updatingId ===
                    Number(selectedApplication.id)
                  }
                  onClick={() =>
                    handleStatusUpdate(
                      selectedApplication.id,
                      "Rejected"
                    )
                  }
                  className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>

              </div>

              <button
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="w-full rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}