import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const res = await signup(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-indigo-400 to-blue-300 relative">
      
      {/* Top Navbar */}
      <div className="w-full px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-md">
            <span className="font-bold text-indigo-600 text-xl">✓</span>
          </div>
          <span className="text-white font-extrabold text-2xl md:text-3xl">
            CalmTasks
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/signup"
            className="px-4 py-2 rounded-md bg-white/30 text-white font-semibold"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-white/20 text-white hover:bg-white/30 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 flex flex-col md:flex-row items-center justify-center gap-10 py-12 min-h-[calc(100vh-160px)]">

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:flex-1 max-w-xl text-center md:text-left"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
            Sign up for free and start
            <br />
            using{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-indigo-500 to-yellow-400">
              CalmTasks
            </span>{" "}
            in seconds.
          </h1>

          <p className="text-white/90">
            Plan your day calmly — a lightweight task manager to help you focus
            and move forward.
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl"
        >
          <h2 className="text-lg font-semibold text-center mb-4">
            Create your account
          </h2>

          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-indigo-600 text-white hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
