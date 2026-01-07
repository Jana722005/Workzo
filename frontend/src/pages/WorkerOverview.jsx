import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WorkerOverview() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    availableJobs: 0,
    appliedJobs: 0,
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchWorkerOverview = async () => {
      try {
        // Fetch available jobs
        const jobsRes = await fetch(
          "http://localhost:5000/api/jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const jobsData = await jobsRes.json();

        setStats((prev) => ({
          ...prev,
          availableJobs: jobsData.length,
        }));

        setJobs(jobsData.slice(0, 3));

        // Applications count (future-safe)
        setStats((prev) => ({
          ...prev,
          appliedJobs: 0,
        }));
      } catch (error) {
        console.error("Failed to load worker overview", error);
      }
    };

    fetchWorkerOverview();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome 👋
        </h1>
        <p className="text-gray-600">
          Find jobs that match your skills and location.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          label="Available Jobs"
          value={stats.availableJobs}
        />
        <StatCard
          label="Applied Jobs"
          value={stats.appliedJobs}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/dashboard/find-jobs")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Find Jobs
        </button>

        <button
          onClick={() => navigate("/dashboard/applications")}
          className="bg-white border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          My Applications
        </button>
      </div>

      {/* Available Jobs Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Available Jobs
        </h2>

        {jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No jobs available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h3 className="font-medium mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {job.category} • {job.location}
                </p>
                <span className="text-sm text-blue-600">
                  {job.memberLimit}{" "}
                  {job.memberLimit === 1
                    ? "Worker Needed"
                    : "Workers Needed"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
