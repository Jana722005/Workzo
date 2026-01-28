import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewModal({ workerId, jobId, onClose }) {
  const token = localStorage.getItem("token");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
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
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted successfully!");
        onClose();
        // Optional: trigger refresh via context or callback if passed
        window.location.reload(); // Simple refresh to see new rating
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Rate Your Experience</h2>
            <p className="text-blue-100 text-sm mt-1">
              How did the worker perform on this job?
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <span
                      className={`
                        ${star <= (hover || rating)
                          ? "text-yellow-400 drop-shadow-md"
                          : "text-gray-300"
                        }
                      `}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500 h-5">
                {hover === 1 && "Terrible"}
                {hover === 2 && "Poor"}
                {hover === 3 && "Average"}
                {hover === 4 && "Great"}
                {hover === 5 && "Excellent!"}
                {!hover && rating > 0 && `${rating} Star${rating > 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Write a Review (Optional)
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your experience..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={loading || rating === 0}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
