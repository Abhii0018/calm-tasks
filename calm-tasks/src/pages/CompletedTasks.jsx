import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, updateTask, deleteTask } from "../services/api";

export default function CompletedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(res => {
      const completed = res.data.filter(t => t.completed);
      setTasks(completed);
    });
  }, []);

  const undoTask = async (id) => {
    await updateTask(id, { completed: false });
    setTasks(tasks.filter(t => t._id !== id));
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Completed Tasks</h2>
        <div className="flex gap-3">
          <Link to="/" className="px-3 py-1 rounded-full border bg-white/5 text-sm">Home</Link>
          <Link to="/dashboard" className="px-3 py-1 rounded-full bg-gray-800 text-white text-sm">Dashboard</Link>
        </div>
      </div>

      {tasks.map(task => (
        <div
          key={task._id}
          className="flex items-center justify-between p-4 mb-3 rounded-lg bg-green-900 text-white"
        >
          <div>
            <p className="line-through">{task.title}</p>
            <p className="text-xs text-gray-300">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => undoTask(task._id)}>↩</button>
            <button onClick={() => removeTask(task._id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
