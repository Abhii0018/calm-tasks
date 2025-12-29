import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, updateTask } from "../services/api";

export default function PendingTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(res => {
        console.log("ALL TASKS FROM API:", res.data);
      const pending = res.data.filter(t => !t.completed);
      setTasks(pending);
    });
  }, []);

  const markComplete = async (id) => {
    await updateTask(id, { completed: true });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Pending Tasks</h2>
        <div className="flex gap-3">
          <Link to="/" className="px-3 py-1 rounded-full border bg-white/5 text-sm">Home</Link>
          <Link to="/dashboard" className="px-3 py-1 rounded-full bg-gray-800 text-white text-sm">Dashboard</Link>
        </div>
      </div>

      {tasks.map(task => (
        <div
          key={task._id}
          className="flex items-center justify-between p-4 mb-3 rounded-lg bg-neutral-900 text-white"
        >
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>

          <input
            type="checkbox"
            onChange={() => markComplete(task._id)}
            className="w-5 h-5"
          />
        </div>
      ))}
    </div>
  );
}
