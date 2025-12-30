import { useState } from "react";

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [quickDate, setQuickDate] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const iso = new Date().toISOString();
  const todayMin = iso.split("T")[0];
  const nowMinDateTime = iso.slice(0, 16);

  async function handleAdd(e) {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    let finalDue = dueDate;
    if (quickDate === "today" && !showDatePicker) finalDue = todayMin;
    if (finalDue && finalDue < todayMin) {
      setError("Due date cannot be in the past");
      return;
    }

    const finalReminder = reminderDateTime || undefined;
    if (finalReminder && new Date(finalReminder) < new Date()) {
      setError("Reminder cannot be in the past");
      return;
    }

    setError("");
    setLoading(true);
    try {
      console.log("TaskInput: adding", { title: text.trim(), dueDate: finalDue, reminderDate: finalReminder });
      const payload = { title: text.trim() };
      if (finalDue) payload.dueDate = finalDue;
      if (finalReminder) payload.reminderDate = finalReminder;
      const res = await onAdd(payload);
      console.log("TaskInput: add result", res);
      setText("");
      setDueDate("");
      setReminderDateTime("");
      setQuickDate("today");
      setShowDatePicker(false);
    } catch (err) {
      console.error("TaskInput add error:", err);
      // show friendly message if network or axios error
      setError(err?.response?.data?.message || err?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAdd} className="w-full max-w-3xl mx-auto">
      <label className="sr-only">Add task</label>
      <div className="bg-white/80 dark:bg-gray-800 rounded-2xl p-4 shadow-md">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something calm..."
          className="w-full rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow font-medium"
          aria-label="Task title"
        />

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => { setQuickDate('today'); setShowDatePicker(false); setDueDate(''); }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${quickDate==='today' ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-800 dark:text-white'}`}
              aria-pressed={quickDate==='today'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Today</span>
            </button>

            <button
              type="button"
              onClick={() => { setQuickDate('custom'); setShowDatePicker(s => !s); }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${quickDate==='custom' ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-800 dark:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1"/>
                <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Pick date</span>
            </button>

            <button type="button" className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/5 text-gray-700 dark:text-white" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 6v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Priority</span>
            </button>

            <button type="button" className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-white/5 text-gray-700 dark:text-white" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 20v-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Reminders</span>
            </button>

            {showDatePicker && (
              <div className="ml-2 flex items-center gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={todayMin}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm"
                  aria-label="Pick due date"
                />

                <input
                  type="datetime-local"
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                  min={nowMinDateTime}
                  className="px-3 py-1 rounded-md border border-gray-200 text-sm"
                  aria-label="Pick reminder date and time"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setText(''); setDueDate(''); setShowDatePicker(false); setQuickDate('today'); }}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-transparent hover:border-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:opacity-95 transition"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
      </div>
    </form>
  );
}
