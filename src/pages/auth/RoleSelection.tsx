import { Building2, GraduationCap, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      description:
        "Build your profile, discover opportunities, track your skills and get placement-ready.",
      icon: GraduationCap,
      path: "/signup/student",
    },
    {
      title: "College",
      description:
        "Manage students, analyze skills, showcase achievements and connect with industry.",
      icon: Building2,
      path: "/signup/college",
    },
    {
      title: "Company",
      description:
        "Find skilled talent, post opportunities and connect with colleges and students.",
      icon: BriefcaseBusiness,
      path: "/signup/company",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-28 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg">
            C
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome to Career<span className="text-blue-600">X</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            Choose how you want to use CareerX and start building meaningful
            connections between talent, academia and industry.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.title}
                onClick={() => navigate(role.path)}
                className="group rounded-2xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={28} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {role.title}
                </h2>

                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-500">
                  {role.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Continue
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default RoleSelection;