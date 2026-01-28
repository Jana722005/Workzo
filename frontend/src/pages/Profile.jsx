import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileCompletion } from "../utils/profileCompletion";
import { API_BASE_URL } from "../services/api";

export default function Profile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch {
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()),
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (res.ok) {
        setMessage("Profile updated successfully");
      } else {
        setMessage("Failed to update profile");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile…</p>;
  }

  if (!profile) {
    return <p className="text-red-500">Profile not found</p>;
  }

  const isWorker = profile.role === "WORKER";
  const { percent, verified } = getProfileCompletion(profile);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white
              ${isWorker ? "bg-blue-600" : "bg-indigo-600"}`}
            >
              {isWorker ? "👷" : "🏢"}
            </div>

            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.name}
                {verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    ✔ Verified
                  </span>
                )}
              </h1>

              <p className="text-gray-600">
                {isWorker ? "Service Provider" : "Employer"}
              </p>

              <p className="text-sm text-gray-500">
                {profile.location || "Location not set"}
              </p>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="w-full md:w-60">
            <p className="text-sm font-medium mb-1">
              Profile Completion
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${percent === 100
                    ? "bg-green-600"
                    : "bg-blue-600"
                  }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-gray-500">
              {percent}% completed
            </p>
          </div>
        </div>

        {/* ⭐ RATING & JOB COMPLETION (ADDED SAFELY) */}
        {isWorker && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-2xl font-bold text-blue-600">
                ⭐ {profile.rating ?? 0}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">
                Jobs Completed
              </p>
              <p className="text-2xl font-bold text-green-600">
                {profile.completedJobs ?? 0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Personal Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>
            <input
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>
            <input
              value={profile.email}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Contact Number
            </label>
            <input
              name="phoneNumber"
              value={profile.phoneNumber || ""}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Location
            </label>
            <input
              name="location"
              value={profile.location || ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {isWorker && (
            <div>
              <label className="text-sm font-medium">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={profile.age || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* WORKER DETAILS */}
      {isWorker && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Work Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Skills
              </label>
              <input
                value={(profile.skills || []).join(", ")}
                onChange={(e) =>
                  handleArrayChange("skills", e.target.value)
                }
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Work Categories
              </label>
              <input
                value={(profile.categories || []).join(", ")}
                onChange={(e) =>
                  handleArrayChange(
                    "categories",
                    e.target.value
                  )
                }
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Experience
              </label>
              <input
                name="experience"
                value={profile.experience || ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                About
              </label>
              <textarea
                name="about"
                value={profile.about || ""}
                onChange={handleChange}
                rows={4}
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* EMPLOYER ABOUT */}
      {!isWorker && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            About
          </h2>
          <textarea
            name="about"
            value={profile.about || ""}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}
