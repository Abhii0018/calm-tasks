import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: String,
    priority: { type: String, enum: ["high", "low"] },
    dueDate: Date,
    // optional reminder datetime for scheduled email reminders
    reminderDate: Date,
    // whether reminder email was already sent
    reminderSent: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
