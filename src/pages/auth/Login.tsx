import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "college" | "company">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email,
        password,
        role,
      });

      localStorage.setItem("careerx_token", result.token);
      localStorage.setItem("careerx_user", JSON.stringify(result.user));

      alert("Login successful!");

      if (result.user.role === "student") {
        navigate("/student/dashboard");
      } else if (result.user.role === "college") {
        navigate("/college/dashboard");
      } else if (result.user.role === "company") {
        navigate("/company/dashboard");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <LogIn size={26} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to CareerX
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Login as
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  role === "student"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole("college")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  role === "college"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                College
              </button>

              <button
                type="button"
                onClick={() => setRole("company")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  role === "company"
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                Company
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() =>
                  alert("Password reset will be connected in the next module.")
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={18} />

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/roles"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;