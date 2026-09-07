import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";

function StudentSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "",
    course: "",
    branch: "",
    graduationYear: "",
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
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.college ||
      !formData.course ||
      !formData.branch ||
      !formData.graduationYear
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await signupUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "student",
        college: formData.college,
        course: formData.course,
        branch: formData.branch,
        graduationYear: Number(formData.graduationYear),
      });

      // Save authentication token
      localStorage.setItem("careerx_token", result.token);

      // Save logged-in user
      localStorage.setItem(
        "careerx_user",
        JSON.stringify(result.user)
      );

      // Keep student profile data for the existing frontend
      localStorage.setItem(
        "careerx_student",
        JSON.stringify(formData)
      );

      alert("Student account created successfully!");

      navigate("/student/dashboard");
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
          {/* Back */}
          <Link
            to="/roles"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to role selection
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <GraduationCap
                  size={32}
                  className="text-blue-600"
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Create Student Account
              </h1>

              <p className="mt-2 text-slate-500">
                Build your profile and discover opportunities
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email"
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

              {/* College */}
              <div>
                <label
                  htmlFor="college"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  College
                </label>

                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Course + Branch */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="course"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Course
                  </label>

                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select course</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E">B.E</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="branch"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Branch
                  </label>

                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select branch</option>
                    <option value="CSE">
                      Computer Science & Engineering
                    </option>
                    <option value="IT">
                      Information Technology
                    </option>
                    <option value="ECE">
                      Electronics & Communication
                    </option>
                    <option value="EEE">
                      Electrical & Electronics
                    </option>
                    <option value="Mechanical">
                      Mechanical Engineering
                    </option>
                    <option value="Civil">
                      Civil Engineering
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Graduation Year */}
              <div>
                <label
                  htmlFor="graduationYear"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Graduation Year
                </label>

                <select
                  id="graduationYear"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select graduation year</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
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
                    Create Student Account
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

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you agree to use CareerX for
            educational and career development purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;