import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
};

const defaultSkills: Skill[] = [
  {
    id: 1,
    name: "Java",
    category: "Programming",
    level: 85,
  },
  {
    id: 2,
    name: "Python",
    category: "Programming",
    level: 78,
  },
  {
    id: 3,
    name: "SQL",
    category: "Database",
    level: 72,
  },
  {
    id: 4,
    name: "React",
    category: "Web Development",
    level: 65,
  },
];

function StudentSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState(70);

  useEffect(() => {
    const saved = localStorage.getItem("careerx_student_skills");

    if (saved) {
      setSkills(JSON.parse(saved));
    } else {
      setSkills(defaultSkills);
      localStorage.setItem(
        "careerx_student_skills",
        JSON.stringify(defaultSkills)
      );
    }
  }, []);

  const saveSkills = (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);

    localStorage.setItem(
      "careerx_student_skills",
      JSON.stringify(updatedSkills)
    );
  };

  const resetForm = () => {
    setSkillName("");
    setCategory("");
    setLevel(70);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!skillName.trim() || !category) {
      alert("Please enter the skill name and category.");
      return;
    }

    if (editingId !== null) {
      const updated = skills.map((skill) =>
        skill.id === editingId
          ? {
              ...skill,
              name: skillName,
              category,
              level,
            }
          : skill
      );

      saveSkills(updated);
    } else {
      const newSkill: Skill = {
        id: Date.now(),
        name: skillName,
        category,
        level,
      };

      saveSkills([...skills, newSkill]);
    }

    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setSkillName(skill.name);
    setCategory(skill.category);
    setLevel(skill.level);
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    saveSkills(skills.filter((skill) => skill.id !== id));
  };

  const averageLevel =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (total, skill) => total + skill.level,
            0
          ) / skills.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          to="/student/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-semibold text-blue-600">
              Career Profile
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Skills
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your technical skills and proficiency levels.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Skill
          </button>

        </div>

        {/* SUMMARY */}
        <div className="mb-7 grid gap-5 sm:grid-cols-3">

          <SummaryCard
            title="Total Skills"
            value={String(skills.length)}
            description="Skills in your profile"
          />

          <SummaryCard
            title="Average Proficiency"
            value={`${averageLevel}%`}
            description="Across all skills"
          />

          <SummaryCard
            title="Strong Skills"
            value={String(
              skills.filter((skill) => skill.level >= 80).length
            )}
            description="80% proficiency or higher"
          />

        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <section className="mb-7 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId !== null
                    ? "Edit Skill"
                    : "Add New Skill"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a skill and specify your current proficiency.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >

              <div className="grid gap-5 md:grid-cols-3">

                {/* SKILL NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Skill Name
                  </label>

                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) =>
                      setSkillName(e.target.value)
                    }
                    placeholder="e.g. JavaScript"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Programming">
                      Programming
                    </option>

                    <option value="Web Development">
                      Web Development
                    </option>

                    <option value="Database">
                      Database
                    </option>

                    <option value="Cloud">
                      Cloud
                    </option>

                    <option value="Data Science">
                      Data Science
                    </option>

                    <option value="Tools">
                      Tools
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* LEVEL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Proficiency
                  </label>

                  <div className="flex items-center gap-4">

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={level}
                      onChange={(e) =>
                        setLevel(Number(e.target.value))
                      }
                      className="w-full accent-blue-600"
                    />

                    <span className="w-12 rounded-lg bg-blue-50 px-2 py-2 text-center text-sm font-bold text-blue-600">
                      {level}%
                    </span>

                  </div>
                </div>

              </div>

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={17} />

                  {editingId !== null
                    ? "Update Skill"
                    : "Save Skill"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* SKILLS LIST */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Your Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your current technical skill profile.
            </p>
          </div>

          {skills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Plus size={22} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No skills added yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first skill to start building your profile.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {skills.map((skill) => (

                <div
                  key={skill.id}
                  className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    {/* INFO */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-slate-900">
                          {skill.name}
                        </h3>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {skill.category}
                        </span>

                      </div>

                      <div className="mt-4 flex items-center gap-3">

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${skill.level}%`,
                            }}
                          />

                        </div>

                        <span className="w-12 text-right text-sm font-bold text-slate-600">
                          {skill.level}%
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(skill)}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </div>

    </main>
  );
}


/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default StudentSkills;