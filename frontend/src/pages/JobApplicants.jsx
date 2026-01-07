import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setApps([]);
        return;
      }

      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, [jobId, token]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (appId, action) => {
    try {
      await fetch(
        `http://localhost:5000/api/applications/${action}/${appId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplicants();
    } catch {
      alert("Failed to update application");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Job Applicants
      </h1>

      {loading && (
        <p className="text-gray-500">
          Loading applicants…
        </p>
      )}

      {!loading && apps.length === 0 && (
        <p className="text-gray-500">
          No one has applied yet.
        </p>
      )}

      <div className="grid gap-4">
        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
          >
            {/* Applicant Info */}
            <div>
              <p className="font-medium">
                {app.worker.name}
              </p>
              <p className="text-sm text-gray-500">
                {app.worker.email}
              </p>

              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    app.status === "ACCEPTED"
                      ? "text-green-600"
                      : app.status === "REJECTED"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/worker/${app.worker._id}`
                  )
                }
                className="px-3 py-2 border rounded hover:bg-gray-100"
              >
                View Profile
              </button>

              {app.status === "APPLIED" &&
                app.job?.status !== "CLOSED" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(app._id, "accept")
                      }
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(app._id, "reject")
                      }
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
