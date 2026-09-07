import { useEffect, useMemo, useState } from "react";
import {
  getStudentApplications,
  withdrawApplication as withdrawApplicationApi,
} from "../../services/api";

type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected";

type Application = {
  id: string;
  jobId?: string;
  company: string;
  role: string;
  type: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
};




function getStatusClass(
  status: ApplicationStatus
) {
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

  const rawStatus = String(
    app.status ?? "Applied"
  );

  const status: ApplicationStatus =
    rawStatus === "Shortlisted" ||
    rawStatus === "Under Review" ||
    rawStatus === "Rejected"
      ? (rawStatus as ApplicationStatus)
      : "Applied";

  return {
    id: String(
      app.id ?? `application-${index}`
    ),

    jobId:
      app.jobId !== undefined &&
      app.jobId !== null
        ? String(app.jobId)
        : app.job_id !== undefined &&
            app.job_id !== null
          ? String(app.job_id)
          : undefined,

    company: String(
      app.company ??
        app.companyName ??
        app.company_name ??
        "Company"
    ),

    role: String(
      app.role ??
        app.title ??
        app.jobTitle ??
        "Job Opportunity"
    ),

    type: String(
      app.type ?? "Internship"
    ),

    location: String(
      app.location ??
        app.mode ??
        "Location not specified"
    ),

    appliedDate: String(
      app.appliedDate ??
        app.applied_at ??
        app.createdAt ??
        new Date().toISOString()
    ),

    status,
  };
}

export default function StudentApplications() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] = useState<
    "All" | ApplicationStatus
  >("All");

  const [search, setSearch] = useState("");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [withdrawing, setWithdrawing] =
    useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getStudentApplications();

      if (!Array.isArray(data)) {
        setApplications([]);
        return;
      }

      const normalized = data.map(
        normalizeApplication
      );

      /*
       * Real backend applications are now
       * the primary source of truth.
       */
      setApplications(normalized);
    } catch (err) {
      console.error(
        "Unable to load applications:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load applications."
      );

      /*
       * Do not show demo applications when the
       * backend request fails. This makes it clear
       * whether the real backend is working.
       */
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredApplications =
    useMemo(() => {
      const query =
        search.toLowerCase().trim();

      return applications.filter(
        (application) => {
          const matchesFilter =
            filter === "All" ||
            application.status === filter;

          const matchesSearch =
            !query ||
            application.company
              .toLowerCase()
              .includes(query) ||
            application.role
              .toLowerCase()
              .includes(query) ||
            application.type
              .toLowerCase()
              .includes(query) ||
            application.location
              .toLowerCase()
              .includes(query);

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      applications,
      filter,
      search,
    ]);

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

  async function withdrawApplication(
    id: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirmed) return;

    try {
      setWithdrawing(true);

      await withdrawApplicationApi(
        Number(id)
      );

      setApplications((current) =>
        current.filter(
          (application) =>
            application.id !== id
        )
      );

      setSelectedApplication(null);

      alert(
        "Application withdrawn successfully."
      );
    } catch (err) {
      console.error(
        "Withdraw application error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Failed to withdraw application."
      );
    } finally {
      setWithdrawing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Applications
          </h1>

          <p className="mt-2 text-slate-500">
            Track your job and internship applications in one place.
          </p>
        </div>

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
                  onClick={() =>
                    setFilter(item)
                  }
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
              placeholder="Search applications..."
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-80"
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h2 className="text-lg font-semibold text-slate-900">
              Loading applications
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your applications from CareerX.
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-red-700">
              Unable to load applications
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={loadApplications}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredApplications.length ===
          0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📄
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters or apply to a new opportunity.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map(
              (application) => (
                <div
                  key={application.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
                        {application.company
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {application.role}
                        </h2>

                        <p className="mt-1 font-medium text-blue-600">
                          {application.company}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                          <span>
                            {application.type}
                          </span>

                          <span>•</span>

                          <span>
                            {application.location}
                          </span>

                          <span>•</span>

                          <span>
                            Applied{" "}
                            {formatDate(
                              application.appliedDate
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

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
                        View Details
                      </button>

                      {application.status !==
                        "Rejected" && (
                        <button
                          onClick={() =>
                            withdrawApplication(
                              application.id
                            )
                          }
                          disabled={withdrawing}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {withdrawing
                            ? "Withdrawing..."
                            : "Withdraw"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
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
                </div>
              )
            )}
          </div>
        )}

        {/* Details Modal */}
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
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Application Details
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedApplication.role}
                  </h2>
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

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Company
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedApplication.company}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Opportunity Type
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedApplication.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedApplication.location}
                  </p>
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

              <button
                onClick={() =>
                  setSelectedApplication(null)
                }
                className="mt-7 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}