import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

export default function FindJobs() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("JOB FETCH ERROR:", err);
          setError(err.message || "Failed to load jobs");
          setJobs([]);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          setJobs([]);
          setError("No jobs available");
          return;
        }

        setJobs(data);
      } catch (err) {
        console.error("FETCH JOBS FAILED:", err);
        setError("Unable to connect to server");
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) return;

        const apps = await res.json();
        setAppliedJobs(
          Array.isArray(apps)
            ? apps.map((a) => a.job?._id)
            : []
        );
      } catch {
        // silent fail is OK here
      }
    };

    fetchJobs();
    fetchApplications();
  }, [token, navigate]);

  const confirmApply = async () => {
    if (!selectedJob) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}/applications/${selectedJob._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to apply");
        return;
      }

      setAppliedJobs((prev) => [...prev, selectedJob._id]);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSelectedJob(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Find Jobs</h1>

      {/* ERROR STATE */}
      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      {/* EMPTY STATE */}
      {!error && jobs.length === 0 && (
        <p className="text-gray-500">
          No jobs available right now.
        </p>
      )}

      {/* JOB LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => {
          const alreadyApplied = appliedJobs.includes(job._id);
          const isClosed = job.status === "CLOSED";

          return (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {job.category} • {job.location}
                </p>

                <p className="mt-3 text-gray-600 text-sm">
                  {job.description}
                </p>

                <p className="mt-2 text-blue-600 text-sm font-medium">
                  {job.memberLimit}{" "}
                  {job.memberLimit === 1
                    ? "Worker Needed"
                    : "Workers Needed"}
                </p>

                {isClosed && (
                  <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-red-100 text-red-700">
                    Job Closed
                  </span>
                )}
              </div>

              <button
                disabled={alreadyApplied || isClosed}
                onClick={() => setSelectedJob(job)}
                className={`mt-5 px-4 py-2 rounded-lg transition ${alreadyApplied || isClosed
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isClosed
                  ? "Closed"
                  : alreadyApplied
                    ? "Applied"
                    : "Apply"}
              </button>
            </div>
          );
        })}
      </div>

      {/* CONFIRM MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">
              Apply for this job?
            </h2>

            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="font-medium">
                {selectedJob.title}
              </p>
              <p className="text-sm text-gray-500">
                {selectedJob.category} •{" "}
                {selectedJob.location}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmApply}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? "Applying..." : "Confirm Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
