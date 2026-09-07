import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Filter,
  Mail,
  Search,
  Sparkles,
  Star,
  UserCheck,
  X,
  GraduationCap,
  Code2,
  TrendingUp,
} from "lucide-react";
import { getRecommendedCandidates } from "../../services/api";

type Candidate = {
  id: number;
  name: string;
  email: string;
  college: string;
  course: string;
  branch: string;
  cgpa: number;
  readiness: number;
  skills: string[];
  matchScore: number;
  skillMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
};

type SortOption = "match" | "readiness" | "cgpa";

function CompanyCandidates() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobTitle, setJobTitle] = useState("Selected Job");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [minimumMatch, setMinimumMatch] = useState(60);
  const [sortBy, setSortBy] = useState<SortOption>("match");

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [shortlisted, setShortlisted] = useState<number[]>([]);

  useEffect(() => {
    const loadCandidates = async () => {
      if (!jobId) {
        setError("Please select a job to view recommended candidates.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getRecommendedCandidates(Number(jobId));

        setJobTitle(data.job?.title || "Selected Job");
        setCandidates(Array.isArray(data.candidates) ? data.candidates : []);
      } catch (err) {
        console.error("Failed to load candidates:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load recommended candidates"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, [jobId]);

  const filteredCandidates = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.college.toLowerCase().includes(query) ||
        candidate.branch.toLowerCase().includes(query) ||
        candidate.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesMinimum =
        Number(candidate.matchScore || 0) >= minimumMatch;

      return matchesSearch && matchesMinimum;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "readiness") {
        return Number(b.readiness || 0) - Number(a.readiness || 0);
      }

      if (sortBy === "cgpa") {
        return Number(b.cgpa || 0) - Number(a.cgpa || 0);
      }

      return Number(b.matchScore || 0) - Number(a.matchScore || 0);
    });
  }, [candidates, search, minimumMatch, sortBy]);

  const stats = useMemo(() => {
    if (candidates.length === 0) {
      return {
        total: 0,
        excellent: 0,
        averageMatch: 0,
        shortlisted: shortlisted.length,
      };
    }

    const averageMatch =
      candidates.reduce(
        (total, candidate) => total + Number(candidate.matchScore || 0),
        0
      ) / candidates.length;

    return {
      total: candidates.length,
      excellent: candidates.filter(
        (candidate) => Number(candidate.matchScore || 0) >= 80
      ).length,
      averageMatch: Math.round(averageMatch),
      shortlisted: shortlisted.length,
    };
  }, [candidates, shortlisted]);

  function toggleShortlist(candidateId: number) {
    setShortlisted((current) =>
      current.includes(candidateId)
        ? current.filter((id) => id !== candidateId)
        : [...current, candidateId]
    );
  }

  function getMatchColor(score: number) {
    if (score >= 80) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (score >= 60) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (score >= 40) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  }

  function getMatchLabel(score: number) {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Partial Match";
    return "Low Match";
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/company/jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </a>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Sparkles size={23} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    AI-Powered Candidate Matching
                  </p>

                  <h1 className="text-3xl font-bold text-slate-900">
                    Recommended Candidates
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-slate-500">
                Find students whose skills, readiness and academic profile
                closely match your job requirements.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <BriefcaseBusiness size={17} />
                <span className="font-semibold">{jobTitle}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                icon={<UserCheck size={18} />}
                label="Candidates"
                value={stats.total}
              />

              <StatCard
                icon={<Star size={18} />}
                label="80%+ Match"
                value={stats.excellent}
              />

              <StatCard
                icon={<TrendingUp size={18} />}
                label="Avg Match"
                value={`${stats.averageMatch}%`}
              />

              <StatCard
                icon={<CheckCircle2 size={18} />}
                label="Shortlisted"
                value={stats.shortlisted}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Unable to load candidates
            </p>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search candidates, colleges or skills..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Minimum Match */}
            <div className="flex items-center gap-3">
              <Filter size={17} className="text-slate-400" />

              <select
                value={minimumMatch}
                onChange={(event) =>
                  setMinimumMatch(Number(event.target.value))
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value={0}>Any Match</option>
                <option value={40}>40%+ Match</option>
                <option value={60}>60%+ Match</option>
                <option value={70}>70%+ Match</option>
                <option value={80}>80%+ Match</option>
                <option value={90}>90%+ Match</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="match">Sort by Match</option>
                <option value="readiness">Sort by Readiness</option>
                <option value="cgpa">Sort by CGPA</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <h2 className="text-lg font-bold text-slate-900">
              Finding best candidates...
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Matching student skills with your job requirements.
            </p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No candidates found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No students currently match your selected criteria. Try lowering
              the minimum match percentage or changing your search.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredCandidates.map((candidate, index) => {
              const matchScore = Number(candidate.matchScore || 0);
              const skillMatch = Number(
                candidate.skillMatchPercentage || 0
              );

              const isShortlisted = shortlisted.includes(candidate.id);

              return (
                <div
                  key={`${candidate.id}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    {/* Candidate info */}
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                        {candidate.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-slate-900">
                            {candidate.name}
                          </h2>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getMatchColor(
                              matchScore
                            )}`}
                          >
                            {getMatchLabel(matchScore)}
                          </span>
                        </div>

                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={15} />
                          {candidate.email}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap size={16} />
                            {candidate.college || "College not specified"}
                          </span>

                          <span>•</span>

                          <span>
                            {candidate.branch || "Branch not specified"}
                          </span>

                          {candidate.course && (
                            <>
                              <span>•</span>
                              <span>{candidate.course}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Match score */}
                    <div className="flex items-center gap-5">
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Overall Match
                        </p>

                        <p className="mt-1 text-3xl font-bold text-blue-600">
                          {Math.round(matchScore)}%
                        </p>
                      </div>

                      <div className="h-12 w-px bg-slate-200" />

                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Skill Match
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {Math.round(skillMatch)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mt-6 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-3">
                    {/* Match */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Overall Match
                        </p>

                        <span className="text-sm font-bold text-blue-600">
                          {Math.round(matchScore)}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(matchScore, 0),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Readiness */}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Career Readiness
                        </p>

                        <span className="text-sm font-bold text-slate-700">
                          {Math.round(Number(candidate.readiness || 0))}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(Number(candidate.readiness || 0), 0),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* CGPA */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        CGPA
                      </p>

                      <p className="mt-2 text-xl font-bold text-slate-900">
                        {Number(candidate.cgpa || 0) > 0
                          ? Number(candidate.cgpa).toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Code2 size={17} className="text-emerald-600" />

                        <p className="text-sm font-semibold text-slate-900">
                          Matched Skills
                        </p>
                      </div>

                      {candidate.matchedSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.matchedSkills.map(
                            (skill, skillIndex) => (
                              <span
                                key={`${candidate.id}-matched-${skill}-${skillIndex}`}
                                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          No matching skills found.
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Code2 size={17} className="text-amber-600" />

                        <p className="text-sm font-semibold text-slate-900">
                          Skills to Improve
                        </p>
                      </div>

                      {candidate.missingSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {candidate.missingSkills.map(
                            (skill, skillIndex) => (
                              <span
                                key={`${candidate.id}-missing-${skill}-${skillIndex}`}
                                className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-emerald-600">
                          Excellent — no missing required skills.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <p className="text-xs text-slate-400">
                      Match calculated from required skills, readiness and
                      academic performance.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Candidate
                      </button>

                      <button
                        onClick={() => toggleShortlist(candidate.id)}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          isShortlisted
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isShortlisted ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 size={17} />
                            Shortlisted
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserCheck size={17} />
                            Shortlist
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-5"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                    {selectedCandidate.name
                      ?.charAt(0)
                      ?.toUpperCase() || "S"}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      Recommended Candidate
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {selectedCandidate.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCandidate.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <DetailItem
                  icon={<GraduationCap size={18} />}
                  label="College"
                  value={selectedCandidate.college || "Not specified"}
                />

                <DetailItem
                  icon={<BriefcaseBusiness size={18} />}
                  label="Branch"
                  value={selectedCandidate.branch || "Not specified"}
                />

                <DetailItem
                  icon={<TrendingUp size={18} />}
                  label="CGPA"
                  value={
                    Number(selectedCandidate.cgpa || 0) > 0
                      ? Number(selectedCandidate.cgpa).toFixed(2)
                      : "N/A"
                  }
                />
              </div>

              {/* Match Summary */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Overall Match
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      Based on skills, readiness and CGPA
                    </p>
                  </div>

                  <span className="text-3xl font-bold text-blue-700">
                    {Math.round(
                      Number(selectedCandidate.matchScore || 0)
                    )}
                    %
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          Number(selectedCandidate.matchScore || 0),
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Readiness */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Career Readiness
                  </p>

                  <span className="text-sm font-bold text-blue-600">
                    {Math.round(
                      Number(selectedCandidate.readiness || 0)
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          Number(selectedCandidate.readiness || 0),
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Candidate Skills */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Code2 size={18} className="text-blue-600" />

                  <h3 className="font-semibold text-slate-900">
                    Candidate Skills
                  </h3>
                </div>

                {selectedCandidate.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <span
                        key={`${selectedCandidate.id}-skill-${skill}-${index}`}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No skills added yet.
                  </p>
                )}
              </div>

              {/* Matched Skills */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Matched Skills
                  </h3>
                </div>

                {selectedCandidate.matchedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.matchedSkills.map(
                      (skill, index) => (
                        <span
                          key={`${selectedCandidate.id}-modal-matched-${skill}-${index}`}
                          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No matched skills.
                  </p>
                )}
              </div>

              {/* Missing Skills */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Code2 size={18} className="text-amber-600" />

                  <h3 className="font-semibold text-slate-900">
                    Missing Required Skills
                  </h3>
                </div>

                {selectedCandidate.missingSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.missingSkills.map(
                      (skill, index) => (
                        <span
                          key={`${selectedCandidate.id}-modal-missing-${skill}-${index}`}
                          className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600">
                    No missing required skills.
                  </p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  onClick={() =>
                    toggleShortlist(selectedCandidate.id)
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
                    shortlisted.includes(selectedCandidate.id)
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {shortlisted.includes(selectedCandidate.id)
                    ? "Shortlisted"
                    : "Shortlist Candidate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default CompanyCandidates;

