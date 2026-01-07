import { useEffect, useState } from "react";

export default function MyJobs() {
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchMyJobs();
  }, [token]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-gray-600">
          Jobs you have posted on Workzo
        </p>
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-gray-500">
            You haven’t posted any jobs yet.
          </p>
        </div>
      )}

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
          >
            {/* Top Section */}
            <div>
              <h2 className="text-lg font-semibold mb-1">
                {job.title}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {job.category} • {job.location}
              </p>

              <p className="text-gray-700 text-sm leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* Budget */}
                {job.budget ? (
                    <span className="text-blue-600 font-medium">
                    Budget: ₹{job.budget}
                    </span>
                ) : (
                    <span className="text-gray-400 text-sm">
                    Budget not specified
                    </span>
                )}

                {/* Member Limit */}
                <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700">
                    {job.memberLimit}{" "}
                    {job.memberLimit === 1 ? "Worker Needed" : "Workers Needed"}
                </span>
                <button
                    onClick={() =>
                        window.location.href = `/dashboard/my-jobs/${job._id}/applicants`
                    }
                    className="mt-4 px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200"
                 >
                    View Applicants
                </button>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    job.status === "CLOSED"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.status}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
