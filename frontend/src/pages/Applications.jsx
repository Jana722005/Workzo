import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Applications() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchApps = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/applications/my",
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
      } catch (error) {
        console.error("Failed to load applications", error);
        setApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [token]);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading applications…
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        My Applications
      </h1>

      {apps.length === 0 && (
        <p className="text-gray-500">
          You haven’t applied to any jobs yet.
        </p>
      )}

      <div className="grid gap-4">
        {apps.map((app) => {
          if (!app.job) return null;

          return (
            <div
              key={app._id}
              className="bg-white p-6 rounded-xl shadow space-y-4"
            >
              {/* JOB INFO */}
              <div>
                <h3 className="font-semibold text-lg">
                  {app.job.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {app.job.category} • {app.job.location}
                </p>
              </div>

              {/* STATUS */}
              <p className="text-sm">
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

              {/* EMPLOYER CONTACT – ONLY IF ACCEPTED */}
              {app.status === "ACCEPTED" &&
                app.job.employer && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                    <p className="font-medium mb-2 text-green-700">
                      Employer Contact Details
                    </p>

                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">
                          Email:
                        </span>{" "}
                        <span className="font-medium">
                          {app.job.employer.email ||
                            "Not provided"}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-600">
                          Phone:
                        </span>{" "}
                        <span className="font-medium">
                          {app.job.employer.phoneNumber ||
                            "Not provided"}
                        </span>

                      </div>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
