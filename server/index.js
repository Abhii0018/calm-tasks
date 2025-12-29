import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
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
  })
  .catch((err) => console.log("Mongo error:", err));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
