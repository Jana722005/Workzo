import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileCompletion } from "../utils/profileCompletion";

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const [workerRes, reviewRes, jobRes] = await Promise.all([
          fetch(
            `http://localhost:5000/api/users/worker/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          fetch(`http://localhost:5000/api/reviews/${id}`),
          fetch(`http://localhost:5000/api/job-status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!workerRes.ok) {
          navigate(-1);
          return;
        }

        const workerData = await workerRes.json();
        const reviewData = await reviewRes.json();
        const jobData = await jobRes.json();

        // Count completed jobs for this worker
        const completedJobs = Array.isArray(jobData)
          ? jobData.filter(
            (j) =>
              j.worker?._id === id &&
              j.status === "COMPLETED"
          ).length
          : 0;

        setWorker(workerData);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setJobCount(completedJobs);
      } catch {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading worker profile…
      </p>
    );
  }

  if (!worker) {
    return (
      <p className="text-red-500">
        Worker not found
      </p>
    );
  }

  const { verified } = getProfileCompletion(worker);

  // ⭐ Average Rating
  const avgRating =
    reviews.length > 0
      ? (
        reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        ) / reviews.length
      ).toFixed(1)
      : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl">
          👷
        </div>

        {/* Main Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {worker.name}
            {verified && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ✔ Verified
              </span>
            )}
          </h1>

          <p className="text-gray-600">
            Service Provider
          </p>

          <p className="text-sm text-gray-500">
            {worker.location || "Location not provided"}
          </p>

          {/* STATS */}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              ★ {worker.rating?.toFixed(1) || "0.0"} / 5
            </span>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {worker.completedJobs || 0} Jobs Completed
            </span>
          </div>
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">
              {worker.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">
              {worker.phoneNumber || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* WORK DETAILS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-4">
          Work Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Skills</p>
            <p className="font-medium">
              {worker.skills?.length
                ? worker.skills.join(", ")
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Categories
            </p>
            <p className="font-medium">
              {worker.categories?.length
                ? worker.categories.join(", ")
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Experience
            </p>
            <p className="font-medium">
              {worker.experience || "—"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-medium">
              {worker.age || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Ratings & Reviews
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({reviews.length})
            </span>
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-4xl mb-2">📝</p>
            <p className="text-gray-500 font-medium">No reviews yet</p>
            <p className="text-sm text-gray-400">
              Be the first to hire and rate this worker.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="group border-b border-gray-100 last:border-none pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {r.employer?.name?.charAt(0).toUpperCase() || "E"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {r.employer?.name || "Employer"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                    <span className="text-yellow-500 text-sm mr-1">★</span>
                    <span className="font-bold text-gray-700 text-sm">
                      {r.rating}.0
                    </span>
                  </div>
                </div>

                {r.comment && (
                  <p className="text-gray-600 text-sm leading-relaxed pl-[3.25rem]">
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </div>
    </div>
  );
}
