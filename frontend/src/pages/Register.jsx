import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "WORKER",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        
        {/* BRAND */}
        <h1 className="text-3xl font-bold text-center tracking-wide text-green-400">
          WORKZO
        </h1>
        <p className="text-center text-sm text-gray-300 mb-6">
          Create your account
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-300">Account Type</label>
            <select
              name="role"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-black/30 border border-white/20 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-white"
            >
              <option value="WORKER">Worker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold transition"
          >
            Create Account
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
