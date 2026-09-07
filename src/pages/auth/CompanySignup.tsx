import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";

function CompanySignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    industry: "",
    location: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.email ||
      !formData.password ||
      !formData.industry ||
      !formData.location
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await signupUser({
        name: formData.companyName,
        email: formData.email,
        password: formData.password,
        role: "company",
        industry: formData.industry,
        location: formData.location,
        website: formData.website,
      });

      localStorage.setItem(
        "careerx_token",
        result.token
      );

      localStorage.setItem(
        "careerx_user",
        JSON.stringify(result.user)
      );

      localStorage.setItem(
        "careerx_company",
        JSON.stringify(formData)
      );

      alert("Company account created successfully!");

      navigate("/company/dashboard");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">

          <Link
            to="/roles"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to role selection
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">

            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <BriefcaseBusiness
                  size={32}
                  className="text-blue-600"
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Create Company Account
              </h1>

              <p className="mt-2 text-slate-500">
                Discover talent and build your industry pipeline
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Name
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter company email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Minimum 6 characters
                </p>
              </div>

              {/* Industry + Location */}
              <div className="grid gap-6 md:grid-cols-2">

                <div>
                  <label
                    htmlFor="industry"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Industry
                  </label>

                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select industry
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Software">
                      Software
                    </option>
                    <option value="FinTech">
                      FinTech
                    </option>
                    <option value="Healthcare">
                      Healthcare
                    </option>
                    <option value="E-Commerce">
                      E-Commerce
                    </option>
                    <option value="Education">
                      Education
                    </option>
                    <option value="Consulting">
                      Consulting
                    </option>
                    <option value="Manufacturing">
                      Manufacturing
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Website
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating Account..."
                ) : (
                  <>
                    Create Company Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Login
                </Link>
              </p>
            </div>

          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you agree to use CareerX
            for professional recruitment and industry collaboration.
          </p>

        </div>
      </div>
    </div>
  );
}

export default CompanySignup;