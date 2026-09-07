import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/api";

type JobType = "Internship" | "Full-time";
type JobMode = "Remote" | "Hybrid" | "On-site";

function PostJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<JobType>("Internship");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<JobMode>("On-site");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addSkill = () => {
    const cleanedSkill = skillInput.trim();

    if (!cleanedSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === cleanedSkill.toLowerCase()
    );

    if (!alreadyExists) {
      setSkills((current) => [...current, cleanedSkill]);
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((current) =>
      current.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a job title.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the job location.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (!deadline) {
      setError("Please select an application deadline.");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one required skill.");
      return;
    }

    try {
      setLoading(true);

      await createJob({
        title: title.trim(),
        type,
        location: location.trim(),
        mode,
        salary: salary.trim(),
        deadline,
        description: description.trim(),
        eligibility: eligibility.trim(),
        skills,
      });

      setSuccess("Job posted successfully!");

      setTitle("");
      setType("Internship");
      setLocation("");
      setMode("On-site");
      setSalary("");
      setDeadline("");
      setDescription("");
      setEligibility("");
      setSkills([]);
      setSkillInput("");

      setTimeout(() => {
        navigate("/company/jobs");
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to post the job.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/company/jobs")}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Back to Jobs
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BriefcaseBusiness size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Post a New Job
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create an opportunity and connect with talented students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
            <CheckCircle2 size={20} />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide the main details about the opportunity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Title *
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Software Development Intern"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Job Type *
                </label>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as JobType)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              {/* Work Mode */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Work Mode *
                </label>

                <select
                  value={mode}
                  onChange={(event) =>
                    setMode(event.target.value as JobMode)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={16} />
                  Location *
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Hyderabad, Telangana"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Salary / Stipend
                </label>

                <input
                  type="text"
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="e.g. ₹25,000/month or ₹6 LPA"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CalendarDays size={16} />
                  Application Deadline *
                </label>

                <input
                  type="date"
                  value={deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Required Skills
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add the skills candidates should have for this opportunity.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React, Java, Python, SQL"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    <span>{skill}</span>

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full p-0.5 transition hover:bg-blue-100"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {skills.length === 0 && (
              <p className="mt-3 text-xs text-slate-400">
                Press Enter or click Add after entering each skill.
              </p>
            )}
          </div>

          {/* Job Description */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Job Description
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explain the role, responsibilities and what the candidate will
                work on.
              </p>
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the role, responsibilities, projects, technologies and expectations..."
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Eligibility */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Eligibility
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Mention academic or other eligibility requirements.
              </p>
            </div>

            <textarea
              value={eligibility}
              onChange={(event) => setEligibility(event.target.value)}
              placeholder="e.g. CSE/IT students, minimum CGPA 7.0, graduating in 2027..."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/company/jobs")}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Posting Job..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;