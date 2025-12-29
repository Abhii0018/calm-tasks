import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-300 relative">
      {/* Header */}
      <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.95, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            whileHover={{ scale: 1.03, rotate: 2 }}
            className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-md"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 17.5A4.5 4.5 0 0015.5 13H14a4 4 0 10-7.874.992"
                stroke="#6b46c1"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 13l1.8 2L15 9"
                stroke="#6b46c1"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="text-white font-extrabold text-2xl md:text-3xl">
            CalmTasks
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-white/30 text-white font-semibold"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <div className="w-full px-6 flex flex-col items-center md:flex-row md:justify-center gap-8 py-12 min-h-[calc(100vh-160px)]">
        {/* Centered App Header */}
        <div className="w-full text-center mb-6">
            <motion.h1
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "Montserrat, Poppins, Inter, system-ui", letterSpacing: "-0.02em", textShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
            >
              CalmTasks
            </motion.h1>
        </div>
        {/* Hero Text */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-2 w-full md:flex-1 max-w-3xl text-center md:text-left"
        >
          <h1
            className="text-3xl md:text-6xl font-extrabold leading-tight mb-4 text-white"
            style={{ fontFamily: "Poppins, Inter, system-ui" }}
          >
            Sign up for free and start
            <br />
            using{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-indigo-500 to-yellow-400">
              CalmTasks
            </span>{" "}
            in seconds.
          </h1>

          <p className="text-white/90 max-w-xl mx-auto md:mx-0">
            Plan your day calmly — a lightweight task manager to help you focus
            and move forward.
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl order-2 md:order-1"
        >
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">Welcome back</h2>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="you@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-indigo-600 text-white hover:opacity-95 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
