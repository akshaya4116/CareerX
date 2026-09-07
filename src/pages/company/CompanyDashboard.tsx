import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  UserCheck,
  Eye,
  Plus,
  ArrowRight,
  MapPin,
  Building2,
  Clock3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCompanyDashboard } from "../../services/api";

type DashboardCompany = {
  id: number;
  companyName: string;
  industry: string;
  location: string;
};

type DashboardStats = {
  activeJobs: number;
  applications: number;
  shortlisted: number;
  reviewed: number;
};

type DashboardCandidate = {
  id: number;
  name: string;
  email: string;
  college: string;
  course?: string;
  branch: string;
  cgpa: number | null;
  readiness: number | null;
};

type DashboardJob = {
  id: number;
  title: string;
  type: string;
  location: string;
  applications: number;
};

type DashboardData = {
  company: DashboardCompany;
  stats: DashboardStats;
  jobs: DashboardJob[];
  candidates: DashboardCandidate[];
};

type Stat = {
  label: string;
  value: number | string;
  icon: typeof BriefcaseBusiness;
  description: string;
};

export default function CompanyDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Failed to load company dashboard:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load company dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const stats: Stat[] = dashboard
    ? [
        {
          label: "Active Jobs",
          value: dashboard.stats.activeJobs,
          icon: BriefcaseBusiness,
          description: "Currently active",
        },
        {
          label: "Applications",
          value: dashboard.stats.applications,
          icon: Users,
          description: "Total received",
        },
        {
          label: "Shortlisted",
          value: dashboard.stats.shortlisted,
          icon: UserCheck,
          description: "Candidates shortlisted",
        },
        {
          label: "Candidates Reviewed",
          value: dashboard.stats.reviewed,
          icon: Eye,
          description: "Applications reviewed",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-600">
              Loading company dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-6 w-6 text-red-600" />

              <div>
                <h2 className="font-semibold text-red-800">
                  Unable to load dashboard
                </h2>

                <p className="mt-1 text-sm text-red-700">{error}</p>

                <button
                  onClick={loadDashboard}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No dashboard data available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please try refreshing the page.
            </p>

            <button
              onClick={loadDashboard}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const companyName = dashboard.company?.companyName || "Company";
  const industry = dashboard.company?.industry || "Technology";
  const location =
    dashboard.company?.location || "Location not specified";

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Building2 className="h-4 w-4" />
              Company Dashboard
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {companyName}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>{industry}</span>

              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            </div>
          </div>

          <Link
            to="/company/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Candidates */}
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Candidates
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Candidates who recently applied to your jobs
                </p>
              </div>

              <Link
                to="/company/applications"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View applications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {dashboard.candidates.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-300" />

                  <h3 className="mt-3 font-semibold text-slate-800">
                    No candidates yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Candidates will appear here when they apply to your jobs.
                  </p>
                </div>
              ) : (
                dashboard.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                          {candidate.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {candidate.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {candidate.email}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {candidate.college || "College not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs font-medium text-slate-400">
                            CGPA
                          </p>

                          <p className="mt-1 text-lg font-bold text-slate-900">
                            {candidate.cgpa ?? "—"}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs font-medium text-slate-400">
                            Readiness
                          </p>

                          <p className="mt-1 text-lg font-bold text-blue-600">
                            {candidate.readiness != null
                              ? `${candidate.readiness}%`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {candidate.branch && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {candidate.branch}
                        </span>
                      )}

                      {candidate.course && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {candidate.course}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Hiring Summary */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Hiring Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current recruitment activity
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Active jobs
                    </span>

                    <span className="font-bold text-slate-900">
                      {dashboard.stats.activeJobs}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${Math.min(
                          dashboard.stats.activeJobs * 10,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Applications
                    </span>

                    <span className="font-bold text-slate-900">
                      {dashboard.stats.applications}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: `${Math.min(
                          dashboard.stats.applications,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Shortlisted
                    </span>

                    <span className="font-bold text-slate-900">
                      {dashboard.stats.shortlisted}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width:
                          dashboard.stats.applications > 0
                            ? `${Math.min(
                                (dashboard.stats.shortlisted /
                                  dashboard.stats.applications) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Reviewed
                    </span>

                    <span className="font-bold text-slate-900">
                      {dashboard.stats.reviewed}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width:
                          dashboard.stats.applications > 0
                            ? `${Math.min(
                                (dashboard.stats.reviewed /
                                  dashboard.stats.applications) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Quick Actions
              </h3>

              <div className="space-y-2">
                <Link
                  to="/company/jobs/new"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      Post a Job
                    </span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  to="/company/applications"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      Review Applications
                    </span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  to="/company/candidates"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      Find Candidates
                    </span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  to="/company/profile"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                      <Building2 className="h-4 w-4 text-violet-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      Company Profile
                    </span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Active Jobs */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Active Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your currently active opportunities
              </p>
            </div>

            <Link
              to="/company/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {dashboard.jobs.length === 0 ? (
              <div className="p-10 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-3 font-semibold text-slate-800">
                  No active jobs
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Post your first job to start receiving applications.
                </p>

                <Link
                  to="/company/jobs/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Post Job
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Job
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Applications
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Match
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {dashboard.jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {job.title}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              Active
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {job.type}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {job.location || "Not specified"}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="font-semibold text-slate-900">
                            {job.applications}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-medium text-slate-400">
                            —
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Info */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Find the right talent for your organization
              </h3>

              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Use CareerX to discover skilled students, review applications,
                identify skill gaps and build a stronger hiring pipeline.
              </p>
            </div>

            <Link
              to="/company/candidates"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore Candidates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
