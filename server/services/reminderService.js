import cron from "node-cron";
import Task from "../models/Task.js";
import User from "../models/User.js";

async function sendReminderEmail(user, task) {
  try {
    let nodemailer;
    try {
      nodemailer = (await import("nodemailer")).default;
    } catch (e) {
      console.warn("nodemailer not installed; skipping reminder email");
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

    const toEmail = user.email;
    const subject = process.env.REMINDER_SUBJECT || "Reminder from CalmTasks";
    const text = process.env.REMINDER_TEXT || `⏰ Reminder: You planned to '${task.title}'. Stay calm and get it done.`;

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject,
      text,
    });

    console.log("Reminder sent for task", task._id, "msgId:", info.messageId);
  } catch (err) {
    console.error("Error sending reminder email:", err);
  }
}

export function startReminderService() {
  if (process.env.DISABLE_REMINDERS === "true") {
    console.log("Reminder service disabled via DISABLE_REMINDERS");
    return;
  }

  console.log("Starting reminder service (runs every minute)");

  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();
      // Claim due reminders atomically to avoid duplicates
      while (true) {
        const task = await Task.findOneAndUpdate(
          { reminderDate: { $lte: now }, reminderSent: false },
          { $set: { reminderSent: true } },
          { new: true }
        );
        if (!task) break;

        const user = await User.findById(task.user);
        if (user && user.email) {
          await sendReminderEmail(user, task);
        } else {
          console.warn("No user/email for reminder task", task._id);
        }
      }
    } catch (err) {
      console.error("Reminder job error:", err);
    }
  });
}
