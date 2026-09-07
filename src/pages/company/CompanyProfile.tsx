import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  MapPin,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../../services/api";

type CompanyData = {
  companyName: string;
  email: string;
  industry: string;
  location: string;
  website: string;
  description: string;
};

const EMPTY_COMPANY: CompanyData = {
  companyName: "",
  email: "",
  industry: "",
  location: "",
  website: "",
  description: "",
};

function CompanyProfile() {
  const [company, setCompany] = useState<CompanyData>(EMPTY_COMPANY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyProfile();

      setCompany({
        companyName: data.companyName || "",
        email: data.email || "",
        industry: data.industry || "",
        location: data.location || "",
        website: data.website || "",
        description: data.description || "",
      });
    } catch (err) {
      console.error("Failed to load company profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load company profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof CompanyData,
    value: string
  ) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await updateCompanyProfile(company);

      localStorage.setItem(
        "careerx_company",
        JSON.stringify(company)
      );

      setSaved(true);
    } catch (err) {
      console.error("Failed to save company profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save company profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading company profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <Link
          to="/company/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Building2 size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Company Profile
              </h1>

              <p className="text-slate-500">
                Manage your company information and hiring profile.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Company Information
            </h2>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Name
                </label>

                <input
                  value={company.companyName}
                  onChange={(e) =>
                    handleChange(
                      "companyName",
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400"
                  />

                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) =>
                      handleChange(
                        "email",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="company@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Industry
                </label>

                <select
                  value={company.industry}
                  onChange={(e) =>
                    handleChange(
                      "industry",
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select industry
                  </option>
                  <option>
                    Information Technology
                  </option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Manufacturing</option>
                  <option>Consulting</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400"
                  />

                  <input
                    value={company.location}
                    onChange={(e) =>
                      handleChange(
                        "location",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Hyderabad, Telangana"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Website
                </label>

                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-4 top-3.5 text-slate-400"
                  />

                  <input
                    type="url"
                    value={company.website}
                    onChange={(e) =>
                      handleChange(
                        "website",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Company Description
                </label>

                <textarea
                  value={company.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tell students and colleges about your company..."
                />
              </div>

            </div>

            <div className="mt-8 flex items-center justify-end gap-4 border-t border-slate-200 pt-6">

              {saved && (
                <span className="text-sm font-medium text-green-600">
                  Profile saved successfully!
                </span>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;