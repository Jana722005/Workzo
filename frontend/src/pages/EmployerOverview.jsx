import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployerOverview() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    workersNeeded: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const jobs = await res.json();

        const activeJobs = jobs.length;
        const workersNeeded = jobs.reduce(
          (sum, job) => sum + (job.memberLimit || 0),
          0
        );

        setStats({
          totalJobs: jobs.length,
          activeJobs,
          workersNeeded,
        });

        setRecentJobs(jobs.slice(0, 3));
      } catch (error) {
        console.error("Failed to load overview", error);
      }
    };

    fetchOverviewData();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back 👋
        </h1>
        <p className="text-gray-600">
          Here’s a quick look at your job activity on Workzo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total Jobs" value={stats.totalJobs} />
        <StatCard label="Active Jobs" value={stats.activeJobs} />
        <StatCard label="Workers Needed" value={stats.workersNeeded} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/dashboard/post-job")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Post a Job
        </button>

        <button
          onClick={() => navigate("/dashboard/my-jobs")}
          className="bg-white border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          View My Jobs
        </button>
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Recent Jobs
        </h2>

        {recentJobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            You haven’t posted any jobs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
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

/* Small reusable stat card */
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
