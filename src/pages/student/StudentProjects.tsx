import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  getStudentProjects,
  addStudentProject,
  updateStudentProject,
  deleteStudentProject,
} from "../../services/api";

type Project = {
  id: number;
  title: string;
  description: string;
  technologies: string | string[];
  github_url: string;
  demo_url: string;
  type: string;
  status: string;
};

type ProjectForm = {
  title: string;
  description: string;
  technologies: string;
  github_url: string;
  demo_url: string;
  type: string;
  status: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  technologies: "",
  github_url: "",
  demo_url: "",
  type: "Academic",
  status: "Completed",
};

function formatTechnologies(technologies: unknown): string[] {
  if (Array.isArray(technologies)) {
    return technologies
      .map((tech) => String(tech).trim())
      .filter(Boolean);
  }

  if (typeof technologies === "string") {
    return technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeProject(project: any): Project {
  return {
    id: Number(project.id),
    title: String(project.title || ""),
    description: String(project.description || ""),
    technologies: project.technologies || "",
    github_url: String(
      project.github_url || project.githubUrl || ""
    ),
    demo_url: String(
      project.demo_url || project.demoUrl || ""
    ),
    type: String(project.type || "Academic"),
    status: String(project.status || "Completed"),
  };
}

function StudentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<ProjectForm>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await getStudentProjects();

      let data: any[] = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.projects)) {
        data = response.projects;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      } else if (Array.isArray(response?.data?.projects)) {
        data = response.data.projects;
      }

      setProjects(data.map(normalizeProject));
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description,
      technologies: formatTechnologies(project.technologies).join(", "),
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      type: project.type || "Academic",
      status: project.status || "Completed",
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    if (!form.technologies.trim()) {
      setError("Please add at least one technology.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        technologies: form.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
          .join(", "),
        github_url: form.github_url.trim(),
        demo_url: form.demo_url.trim(),
        type: form.type,
        status: form.status,
      };

      if (editingId !== null) {
        const response = await updateStudentProject(
          editingId,
          payload
        );

        const updatedProject = normalizeProject(
          response?.project || response?.data || response
        );

        setProjects((previous) =>
          previous.map((project) =>
            project.id === editingId
              ? {
                  ...project,
                  ...updatedProject,
                  id: editingId,
                }
              : project
          )
        );

        setSuccess("Project updated successfully.");
      } else {
        const response = await addStudentProject(payload);

        const newProject = normalizeProject(
          response?.project || response?.data || response
        );

        if (newProject.id) {
          setProjects((previous) => [
            newProject,
            ...previous,
          ]);
        } else {
          await loadProjects();
        }

        setSuccess("Project added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save project:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteStudentProject(id);

      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      );

      setSuccess("Project deleted successfully.");
    } catch (err) {
      console.error("Failed to delete project:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete project."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-blue-600">
              Student Profile
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              My Projects
            </h1>

            <p className="mt-2 text-slate-600">
              Showcase your academic, personal and professional
              projects to colleges and companies.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <span className="text-xl leading-none">+</span>
            Add Project
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId !== null
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add details that help recruiters understand
                  your project.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-3 py-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Project Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. AI Career Recommendation System"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Explain what you built, the problem it solves and your contribution..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Technologies */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Technologies *
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, Express, SQLite"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Separate technologies with commas.
                  </p>
                </div>

                {/* GitHub */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username/project"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Demo */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Live Demo URL
                  </label>

                  <input
                    type="url"
                    name="demo_url"
                    value={form.demo_url}
                    onChange={handleChange}
                    placeholder="https://your-project.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Project Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Academic">
                      Academic
                    </option>

                    <option value="Personal">
                      Personal
                    </option>

                    <option value="Hackathon">
                      Hackathon
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Freelance">
                      Freelance
                    </option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Completed">
                      Completed
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Ongoing">
                      Ongoing
                    </option>
                  </select>
                </div>
              </div>

              {/* Form buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Project"
                      : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="font-medium text-slate-700">
              Loading your projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              📁
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No projects yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Add your academic, personal, hackathon or
              internship projects to strengthen your CareerX
              profile.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Add Your First Project
            </button>
          </div>
        ) : (
          /* Project cards */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => {
              const technologies = formatTechnologies(
                project.technologies
              );

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {project.type}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            project.status === "Completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <h2 className="break-words text-xl font-bold text-slate-900">
                        {project.title}
                      </h2>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(project)
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        title="Edit project"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(project.id)
                        }
                        disabled={
                          deletingId === project.id
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete project"
                      >
                        {deletingId === project.id
                          ? "..."
                          : "🗑"}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {project.description ||
                      "No description provided."}
                  </p>

                  {/* Technologies */}
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Technologies
                    </p>

                    {technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {technologies.map(
                          (technology, index) => (
                            <span
                              key={`${technology}-${index}`}
                              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        No technologies listed.
                      </p>
                    )}
                  </div>

                  {/* Links */}
                  {(project.github_url ||
                    project.demo_url) && (
                    <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <span>↗</span>
                          GitHub
                        </a>
                      )}

                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          <span>↗</span>
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProjects;