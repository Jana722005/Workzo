import { useEffect, useState } from "react";

export default function JobStatus() {
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // FETCH JOB STATUS
  // ============================
  useEffect(() => {
    const fetchJobStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/job-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobStatus();
  }, [token]);

  // ============================
  // COMPLETE JOB + REVIEW
  // ============================
  const completeJob = async () => {
    if (!selectedJob) return;

    setSubmitting(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/job-status/${selectedJob._id}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            review,
          }),
        }
      );

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) =>
            j._id === selectedJob._id
              ? {
                  ...j,
                  status: "COMPLETED",
                  rating,
                  review,
                }
              : j
          )
        );

        setSelectedJob(null);
        setRating(5);
        setReview("");
      }
    } catch {
      // silent fail (no crash)
    } finally {
      setSubmitting(false);
    }
  };

  // ============================
  // UI
  // ============================
  if (loading) {
    return <p className="text-gray-500">Loading job status…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Job Status</h1>

      {jobs.length === 0 && (
        <p className="text-gray-500">
          No active or completed jobs yet.
        </p>
      )}

      {/* JOB CARDS */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">
                  {job.job?.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {job.job?.category} • {job.job?.location}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  job.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {job.status}
              </span>
            </div>

            {/* WORKER CARD */}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  👷
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {job.worker?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned Worker
                  </p>
                </div>
              </div>

              {/* ⭐ Average Rating Badge */}
              <div>
                {job.worker?.rating ? (
                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    ★ {job.worker.rating.toFixed(1)} / 5
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
                    No ratings yet
                  </span>
                )}
              </div>
            </div>

            {/* COMPLETED VIEW */}
            {job.status === "COMPLETED" && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex gap-1 text-yellow-400 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {job.rating >= star ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                {job.review && (
                  <p className="text-sm text-gray-700 italic">
                    “{job.review}”
                  </p>
                )}
              </div>
            )}

            {/* ACTION */}
            {job.status === "IN_PROGRESS" && (
              <div className="pt-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* COMPLETE JOB MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold">
              Complete Job
            </h2>

            {/* ⭐ STAR RATING */}
            <div>
              <p className="text-sm font-medium mb-1">
                Rate the worker
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl focus:outline-none"
                  >
                    <span
                      className={
                        (hoverRating || rating) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {rating} out of 5
              </p>
            </div>

            {/* REVIEW */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a short review (optional)"
              className="w-full border rounded-lg p-3 text-sm"
              rows={3}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={completeJob}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {submitting ? "Submitting…" : "Complete Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
