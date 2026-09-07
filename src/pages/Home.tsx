import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  LineChart,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  const opportunities = [
    {
      company: "TechNova",
      role: "Software Development Intern",
      type: "Internship",
      match: "92%",
    },
    {
      company: "DataSphere",
      role: "Junior Data Analyst",
      type: "Full-time",
      match: "86%",
    },
    {
      company: "CloudWorks",
      role: "Cloud Engineering Intern",
      type: "Internship",
      match: "79%",
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Skill Mapping",
      description:
        "Build a structured skill profile and understand your strengths, gaps and career readiness.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Opportunities",
      description:
        "Discover relevant jobs and internships based on your skills, academics and interests.",
    },
    {
      icon: Search,
      title: "Talent Discovery",
      description:
        "Help companies find students with the right skills and academic background.",
    },
    {
      icon: BarChart3,
      title: "Placement Analytics",
      description:
        "Give colleges meaningful insights into student skills, placement trends and opportunities.",
    },
    {
      icon: Users,
      title: "Industry Connect",
      description:
        "Create a direct bridge between students, colleges and companies.",
    },
    {
      icon: LineChart,
      title: "Career Readiness",
      description:
        "Track progress and identify the next skills students should develop.",
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-50 pt-32">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-12 lg:grid-cols-2">
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              <Sparkles size={16} />
              Connecting Talent • Academia • Industry
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Build Skills.
              <br />
              Discover Opportunities.
              <br />
              <span className="text-blue-600">Get Hired.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
              CareerX connects students, colleges and companies through
              skill mapping, career opportunities, talent discovery and
              placement analytics.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/roles"
                className="group flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Get Started
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Login
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Students
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Colleges
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Companies
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
              {/* Mock Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    STUDENT DASHBOARD
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Welcome back, Alex 👋
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  A
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <PreviewStat value="82%" label="Readiness" />

                <PreviewStat value="87%" label="Skill Match" />

                <PreviewStat value="24" label="Opportunities" />

                <PreviewStat value="78%" label="Profile" />
              </div>

              {/* Skills */}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">
                      Your Skills
                    </h4>

                    <span className="text-xs font-semibold text-blue-600">
                      View all
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <PreviewSkill name="Java" value={85} />
                    <PreviewSkill name="Python" value={78} />
                    <PreviewSkill name="SQL" value={72} />
                    <PreviewSkill name="React" value={65} />
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-600 p-5 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <Target size={20} />
                  </div>

                  <p className="mt-5 text-sm text-blue-100">
                    Recommended next skill
                  </p>

                  <h4 className="mt-2 text-xl font-bold">
                    React Development
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-blue-100">
                    Improving this skill could increase your match
                    with several current opportunities.
                  </p>

                  <div className="mt-5 rounded-xl bg-white/10 px-4 py-3">
                    <div className="flex justify-between text-xs">
                      <span>Current level</span>
                      <span>65%</span>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section className="border-y border-slate-100 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              One connected ecosystem
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for everyone in the career journey
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              CareerX brings the three sides of the ecosystem together
              on one platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={GraduationCap}
              title="Students"
              description="Build your profile, manage skills, discover opportunities and become placement-ready."
              link="/roles"
            />

            <RoleCard
              icon={Building2}
              title="Colleges"
              description="Understand student capabilities, identify skill gaps and showcase placement achievements."
              link="/roles"
            />

            <RoleCard
              icon={BriefcaseBusiness}
              title="Companies"
              description="Discover skilled candidates, post opportunities and connect directly with institutions."
              link="/roles"
            />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Everything connected
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From skills to opportunities
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              CareerX provides the tools needed to understand talent,
              improve skills and create better career connections.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= OPPORTUNITIES ================= */}
      <section id="opportunities" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Opportunities
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Find opportunities that fit your skills
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-500">
                Students can discover relevant internships and jobs
                while companies find candidates who match their requirements.
              </p>
            </div>

            <Link
              to="/roles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Explore CareerX
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {opportunities.map((opportunity) => (
              <div
                key={opportunity.company}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {opportunity.company.charAt(0)}
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                    {opportunity.match} match
                  </span>
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {opportunity.company}
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {opportunity.role}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {opportunity.type}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <span className="text-sm font-semibold text-blue-600">
                    View opportunity →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Sparkles size={26} />
          </div>

          <h2 className="mt-7 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Build the career ecosystem together.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Whether you're a student looking for your next opportunity,
            a college developing future talent, or a company searching
            for skilled candidates — CareerX connects you.
          </p>

          <Link
            to="/roles"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started with CareerX
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              C
            </div>

            <span>
              Career<span className="text-blue-500">X</span>
            </span>
          </div>

          <p>Connecting Talent • Academia • Industry</p>
        </div>
      </footer>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function PreviewStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <p className="text-lg font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

function PreviewSkill({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-600">{name}</span>
        <span className="text-slate-400">{value}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={25} />
      </div>

      <h3 className="mt-6 text-xl font-bold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
        Explore
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

export default Home;