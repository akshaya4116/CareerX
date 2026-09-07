import { useEffect, useState } from "react";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
} from "lucide-react";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../../services/api";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  branch: string;
  graduationYear: string;
  location: string;
  bio: string;
  cgpa: string;
}

const emptyProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  branch: "",
  graduationYear: "",
  location: "",
  bio: "",
  cgpa: "",
};

function StudentProfile() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setMessage("");

      const result = await getStudentProfile();

      if (result.student) {
        setProfile({
          fullName: result.student.fullName || "",
          email: result.student.email || "",
          phone: result.student.phone || "",
          college: result.student.college || "",
          course: result.student.course || "",
          branch: result.student.branch || "",
          graduationYear:
            result.student.graduationYear !== ""
              ? String(result.student.graduationYear)
              : "",
          location: result.student.location || "",
          bio: result.student.bio || "",
          cgpa:
            result.student.cgpa !== ""
              ? String(result.student.cgpa)
              : "",
        });
      }
    } catch (error) {
      console.error("Failed to load student profile:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof ProfileData,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const result = await updateStudentProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        college: profile.college,
        course: profile.course,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        location: profile.location,
        bio: profile.bio,
        cgpa: profile.cgpa,
      });

      if (result.student) {
        setProfile({
          fullName: result.student.fullName || "",
          email: result.student.email || profile.email,
          phone: result.student.phone || "",
          college: result.student.college || "",
          course: result.student.course || "",
          branch: result.student.branch || "",
          graduationYear:
            result.student.graduationYear !== ""
              ? String(result.student.graduationYear)
              : "",
          location: result.student.location || "",
          bio: result.student.bio || "",
          cgpa:
            result.student.cgpa !== ""
              ? String(result.student.cgpa)
              : "",
        });
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal, academic and career information.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        {/* Personal Information */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <User className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="text-sm text-slate-500">
                Your basic profile details
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="Full Name"
              value={profile.fullName}
              onChange={(value) =>
                handleChange("fullName", value)
              }
            />

            <InputField
              label="Email"
              value={profile.email}
              disabled={true}
              onChange={() => {}}
              icon={<Mail className="h-4 w-4" />}
            />

            <InputField
              label="Phone"
              value={profile.phone}
              onChange={(value) =>
                handleChange("phone", value)
              }
              icon={<Phone className="h-4 w-4" />}
            />

            <InputField
              label="Location"
              value={profile.location}
              onChange={(value) =>
                handleChange("location", value)
              }
              icon={<MapPin className="h-4 w-4" />}
            />

          </div>
        </section>

        {/* Academic Information */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Academic Information
              </h2>

              <p className="text-sm text-slate-500">
                Your education details
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="College"
              value={profile.college}
              onChange={(value) =>
                handleChange("college", value)
              }
            />

            <InputField
              label="Course"
              value={profile.course}
              onChange={(value) =>
                handleChange("course", value)
              }
            />

            <InputField
              label="Branch"
              value={profile.branch}
              onChange={(value) =>
                handleChange("branch", value)
              }
            />

            <InputField
              label="Graduation Year"
              value={profile.graduationYear}
              onChange={(value) =>
                handleChange("graduationYear", value)
              }
            />

            <InputField
              label="CGPA"
              value={profile.cgpa}
              onChange={(value) =>
                handleChange("cgpa", value)
              }
            />

          </div>
        </section>

        {/* About */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            About Me
          </h2>

          <p className="mb-4 mt-2 text-sm text-slate-500">
            Tell recruiters and companies about yourself.
          </p>

          <textarea
            value={profile.bio}
            onChange={(event) =>
              handleChange("bio", event.target.value)
            }
            rows={5}
            placeholder="Write a short introduction about yourself..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </section>

        {/* Save Button */}
        <div className="flex justify-end">

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Save className="h-4 w-4" />

            {saving ? "Saving..." : "Save Changes"}

          </button>

        </div>

      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactElement;
}

function InputField({
  label,
  value,
  onChange,
  disabled = false,
  icon,
}: InputFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
            icon ? "pl-10" : ""
          } ${
            disabled
              ? "cursor-not-allowed bg-slate-100 text-slate-500"
              : "bg-white"
          }`}
        />

      </div>

    </div>
  );
}

export default StudentProfile;