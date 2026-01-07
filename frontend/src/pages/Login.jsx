import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // LOGIN HANDLER (UNCHANGED)
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND VERIFICATION (UNCHANGED)
  // =========================
  const handleResendVerification = async () => {
    if (!email) {
      setMessage("Please enter your email first");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/resend-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      setMessage(data.message || "Verification email sent");
    } catch {
      setMessage("Failed to resend verification email");
    }
  };

  // =========================
  // UI ONLY BELOW
  // =========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        
        {/* BRAND */}
        <h2 className="text-3xl font-bold text-center tracking-wide text-blue-400">
          WORKZO
        </h2>
        <p className="text-center text-sm text-gray-300 mt-1 mb-6">
          Sign in to continue
        </p>

        {/* MESSAGE */}
        {message && (
          <div className="mb-4 text-sm text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* RESEND */}
        <div className="mt-4 text-center text-sm text-gray-300">
          Didn’t receive verification?{" "}
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-blue-400 hover:underline font-medium"
          >
            Resend email
          </button>
        </div>

        {/* REGISTER */}
        <div className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
