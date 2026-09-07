import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            C
          </div>

          <span className="text-2xl font-bold text-slate-900">
            Career<span className="text-blue-600">X</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/roles"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Students
          </Link>

          <Link
            to="/roles"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Colleges
          </Link>

          <Link
            to="/roles"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Companies
          </Link>
        </div>

        <Link
          to="/roles"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;