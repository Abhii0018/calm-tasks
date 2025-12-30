import express from "express";
import Task from "../models/Task.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// helper: send completion email
async function sendCompletionEmail(toEmail, task) {
  try {
    let nodemailer;
    try {
      nodemailer = (await import("nodemailer")).default;
    } catch (e) {
      console.warn("nodemailer not available; skipping email send");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject: `Task completed: ${task.title}`,
      text: `Your task "${task.title}" was completed successfully on ${new Date().toLocaleString()}.`,
      html: `<p>Your task <strong>${task.title}</strong> was completed successfully on ${new Date().toLocaleString()}.</p>`,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

// Get tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Create task (supports title, content, priority, dueDate)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, priority, dueDate, reminderDate } = req.body;
    const task = await Task.create({
      title,
      content,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      reminderDate: reminderDate ? new Date(reminderDate) : undefined,
      reminderSent: false,
      user: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Create task failed:", err);
    res.status(500).json({ message: "Create task failed" });
  }
});

// Update task (if marking completed, send email to user)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    // fetch existing
    const existing = await Task.findById(id);
    if (!existing) return res.status(404).json({ message: "Task not found" });

    const wasCompleted = existing.completed;

    // prepare update data
    const updateData = { ...req.body };
    if (req.body.dueDate) updateData.dueDate = new Date(req.body.dueDate);
    if (req.body.reminderDate) updateData.reminderDate = new Date(req.body.reminderDate);

    // if reminder was already sent but user sets a future reminder, reset reminderSent
    if (req.body.reminderDate && existing.reminderSent) {
      const newRem = new Date(req.body.reminderDate);
      if (newRem > new Date()) updateData.reminderSent = false;
    }

    const updated = await Task.findByIdAndUpdate(id, updateData, { new: true });

    // if newly completed, send email
    if (!wasCompleted && updated.completed) {
      try {
        const user = await User.findById(req.user.id);
        if (user && user.email) {
          await sendCompletionEmail(user.email, updated);
        }
      } catch (err) {
        console.error("Error fetching user or sending email:", err);
      }
    }

    res.json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await Task.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
