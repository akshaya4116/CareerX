import { useState } from "react";
import {
  Award,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  GraduationCap,
  Medal,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";

type Student = {
  name: string;
  branch: string;
  cgpa: string;
  skills: string[];
  achievement: string;
  placement: string;
};

type Company = {
  name: string;
  hiring: string;
  students: number;
};

const featuredStudents: Student[] = [
  {
    name: "Aarav Sharma",
    branch: "CSE",
    cgpa: "9.4",
    skills: ["Java", "DSA", "React", "SQL"],
    achievement: "Winner - National Coding Challenge",
    placement: "TechNova",
  },
  {
    name: "Priya Reddy",
    branch: "CSE",
    cgpa: "9.2",
    skills: ["Python", "ML", "SQL", "TensorFlow"],
    achievement: "AI Innovation Award 2026",
    placement: "DataSphere",
  },
  {
    name: "Rahul Verma",
    branch: "IT",
    cgpa: "9.1",
    skills: ["Java", "Spring Boot", "SQL", "AWS"],
    achievement: "Best Final Year Project",
    placement: "CloudWorks",
  },
  {
    name: "Ananya Singh",
    branch: "ECE",
    cgpa: "9.0",
    skills: ["Python", "Embedded", "IoT", "C"],
    achievement: "Smart India Hackathon Finalist",
    placement: "Deloitte",
  },
];

const companies: Company[] = [
  {
    name: "TechNova",
    hiring: "Software Engineering",
    students: 58,
  },
  {
    name: "DataSphere",
    hiring: "Data & Analytics",
    students: 46,
  },
  {
    name: "CloudWorks",
    hiring: "Cloud Engineering",
    students: 39,
  },
  {
    name: "Deloitte",
    hiring: "Technology Consulting",
    students: 34,
  },
  {
    name: "Infosys",
    hiring: "Software Development",
    students: 31,
  },
];

const achievements = [
  {
    icon: Trophy,
    title: "86%",
    description: "Placement Rate",
  },
  {
    icon: Users,
    title: "972+",
    description: "Students Placed",
  },
  {
    icon: Building2,
    title: "38",
    description: "Industry Partners",
  },
  {
    icon: Award,
    title: "124",
    description: "Student Achievements",
  },
];

export default function CollegeShowcase() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-8 py-10 text-white shadow-sm">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-100">
              <GraduationCap size={18} />
              College Showcase
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Showcase Your Institution&apos;s Talent
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
              Highlight your students&apos; achievements, placement success,
              industry partnerships and academic excellence to companies and
              prospective students.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50">
                Edit Showcase
              </button>

              <button className="rounded-xl border border-blue-400 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                Preview Public Page
              </button>
            </div>
          </div>

          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500 opacity-50" />
          <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-blue-700 opacity-40" />
        </div>

        {/* Achievement Stats */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.description}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {item.title}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Students */}
        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Star size={19} className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Featured Student Talent
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Students with exceptional academic performance, skills and
                achievements.
              </p>
            </div>

            <button className="hidden items-center gap-1 text-sm font-semibold text-blue-600 sm:flex">
              View all students
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredStudents.map((student) => (
              <button
                key={student.name}
                onClick={() => setSelectedStudent(student)}
                className="text-left"
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                      {student.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      CGPA {student.cgpa}
                    </span>
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    {student.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {student.branch} • Placement Ready
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {student.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Achievement
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">
                      {student.achievement}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <BriefcaseBusiness size={14} />
                    Placed at {student.placement}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* College Excellence */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Medal size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Academic & Student Excellence
                </h2>
                <p className="text-xs text-slate-500">
                  Highlights that make your institution stand out.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                [
                  "National Hackathon Finalists",
                  "18 students",
                ],
                [
                  "Industry Certifications",
                  "426 certifications",
                ],
                [
                  "Research & Innovation Projects",
                  "74 projects",
                ],
                [
                  "Coding Competition Winners",
                  "32 students",
                ],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      {title}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Highlights */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Target size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Placement Highlights
                </h2>
                <p className="text-xs text-slate-500">
                  Showcase recent placement achievements.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Overall Placement Rate
                  </p>

                  <p className="mt-2 text-4xl font-bold text-slate-900">
                    86%
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  +4.2% YoY
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "86%" }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Highest Package</p>
                  <p className="mt-1 font-bold text-slate-900">₹18.5 LPA</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Average Package</p>
                  <p className="mt-1 font-bold text-slate-900">₹7.8 LPA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Partners */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Building2 size={19} className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Industry Partners
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Companies actively hiring and collaborating with your
                institution.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              38 Active Partners
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {companies.map((company) => (
              <div
                key={company.name}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700">
                  {company.name.charAt(0)}
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  {company.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {company.hiring}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <Users size={14} />
                  {company.students} students hired
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Public Showcase CTA */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-900">
                Make your college visible to industry
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-700">
                Publish your college showcase so companies can discover your
                strongest student talent, placement outcomes and academic
                achievements.
              </p>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Publish Showcase
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {/* Student Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {selectedStudent.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selectedStudent.branch} • CGPA {selectedStudent.cgpa}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Key Achievement
              </p>

              <p className="mt-2 font-semibold text-slate-800">
                {selectedStudent.achievement}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-bold text-slate-900">
                Core Skills
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedStudent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-600">
                PLACEMENT
              </p>

              <p className="mt-1 font-bold text-emerald-800">
                {selectedStudent.placement}
              </p>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
