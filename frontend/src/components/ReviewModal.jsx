import { useState } from "react";

export default function ReviewModal({
  workerId,
  jobId,
  onClose,
}) {
  const token = localStorage.getItem("token");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);

    const res = await fetch(
      "http://localhost:5000/api/reviews",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workerId,
          jobId,
          rating,
          comment,
        }),
      }
    );

    setLoading(false);

    if (res.ok) {
      alert("Review submitted");
      onClose();
    } else {
      const err = await res.json();
      alert(err.message || "Failed to submit review");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Rate Worker
        </h2>

        <label className="block mb-2 text-sm">
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm">
          Comment
        </label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={submitReview}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
