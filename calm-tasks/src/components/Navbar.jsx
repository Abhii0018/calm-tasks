import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Re-check auth on route change
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex justify-between items-center px-6 md:px-12 py-6 bg-transparent"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 17.5A4.5 4.5 0 0015.5 13H14a4 4 0 10-7.874.992" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-2xl md:text-3xl font-extrabold brand-title-shadow">CalmTasks</span>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4 text-sm">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-full bg-white/20 text-white shadow-sm hover:opacity-90 transition"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline text-white">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-white/10 text-white hover:opacity-90 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
