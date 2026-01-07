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
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-lg mb-4">
          Ratings & Reviews
        </h2>

        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm">
            No reviews yet
          </p>
        )}

        {reviews.map((r) => (
          <div
            key={r._id}
            className="border-b last:border-none pb-4 mb-4"
          >
            <div className="flex justify-between">
              <p className="font-medium">
                {r.employer?.name || "Employer"}
              </p>
              <div className="text-yellow-500">
                {"★".repeat(r.rating)}
              </div>
            </div>

            {r.comment && (
              <p className="text-sm text-gray-600 mt-1">
                {r.comment}
              </p>
            )}
          </div>
        ))}
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
