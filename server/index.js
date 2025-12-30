import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskRoutes from "./routes/tasks.js";
import { startReminderService } from "./services/reminderService.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
// CORS: in development allow any origin for convenience; in production use configured FRONTEND_URLS
if (process.env.NODE_ENV !== "production") {
  console.log("Development mode: enabling permissive CORS for local testing");
  app.use(cors());
} else {
  const allowedOrigins = (process.env.FRONTEND_URLS || "https://calm-tasks-five.vercel.app").split(",").map(s => s.trim());
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
        console.warn("Blocked CORS origin:", origin);
        return callback(new Error("CORS policy: origin not allowed"));
      },
      credentials: true,
    })
  );
  app.options("*", cors());
}
app.use(express.json()); // ✅ MUST be before routes

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Auth server running");
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Connected DB:", mongoose.connection.name); // ✅ VERY IMPORTANT
    // start reminders after DB connect
    try {
      startReminderService();
    } catch (err) {
      console.error("Failed to start reminder service:", err);
    }
  })
  .catch((err) => console.log("Mongo error:", err));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
