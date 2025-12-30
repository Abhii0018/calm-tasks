import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, createTask, deleteTask, updateTask } from "../services/api";
import TaskInput from "../components/TaskInput";

const ACCENTS = {
	indigo: "bg-indigo-500 text-indigo-500 ring-indigo-400",
	emerald: "bg-emerald-500 text-emerald-500 ring-emerald-400",
	rose: "bg-rose-500 text-rose-500 ring-rose-400",
	amber: "bg-amber-500 text-amber-500 ring-amber-400",
};

export default function Dashboard() {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);
	const [dark, setDark] = useState(true);
	const [accent, setAccent] = useState("indigo");
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [addLoading, setAddLoading] = useState(false);
	const [addError, setAddError] = useState("");
	const [toast, setToast] = useState({ show: false, msg: "" });

	useEffect(() => {
		const root = document.documentElement;
		dark ? root.classList.add("dark") : root.classList.remove("dark");
	}, [dark]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			setAddError("Please login to view and add tasks.");
			return;
		}

		(async () => {
			try {
				const res = await getTasks();
				setTasks(res.data);
			} catch (err) {
				console.error("Failed to load tasks:", err);
				const msg = err.response?.data?.message || err.message || "";
				if (err.response?.status === 401 || /token|invalid/i.test(msg)) {
					setAddError("Authentication required — please login.");
					navigate("/login");
				}
			}
		})();
	}, [navigate]);

	async function handleAddFromInput({ title, dueDate, reminderDate }) {
		if (!title || !title.trim()) return;
		if (!localStorage.getItem("token")) {
			setAddError("Please login to add tasks.");
			navigate('/login');
			return;
		}
		setAddError("");
		setAddLoading(true);
		try {
			const payload = { title };
			if (dueDate) payload.dueDate = dueDate;
			if (reminderDate) payload.reminderDate = reminderDate;
			const res = await createTask(payload);
			setTasks((prev) => [res.data, ...prev]);
			return res.data;
		} catch (err) {
			console.error("Add task failed:", err);
			const msg = err.response?.data?.message || err.message || "Add failed";
			setAddError(msg);
			if (err.response?.status === 401 || /token|invalid/i.test(msg)) {
				setTimeout(() => navigate('/login'), 700);
			}
			// rethrow so callers (TaskInput) can show error too
			throw err;
		} finally {
			setAddLoading(false);
		}
	}

	async function toggleTask(task) {
		try {
			const res = await updateTask(task._id, { completed: !task.completed });
			setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
			if (res.data.completed) {
				setToast({ show: true, msg: `🎉 You successfully completed '${res.data.title}' in CalmTasks` });
				setTimeout(() => setToast({ show: false, msg: "" }), 3500);
			}
		} catch (err) {
			console.error("Toggle failed:", err);
		}
	}

	async function handleDelete(id) {
		await deleteTask(id);
		setTasks(tasks.filter((t) => t._id !== id));
	}

	async function saveEdit(task) {
		const res = await updateTask(task._id, { title: editText });
		setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
		setEditingId(null);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="
				min-h-screen px-6 py-8
				bg-gradient-to-br
				from-[#f6f3ee] to-[#ebe6dc]
				dark:from-[#0b0b0b] dark:to-[#121212]
				text-gray-900 dark:text-[#EDEDED]
				transition-colors duration-500
			"
		>
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<motion.h1
					initial={{ y: -6, opacity: 0, scale: 0.99 }}
					animate={{ y: 0, opacity: 1, scale: 1 }}
					whileHover={{ scale: 1.02 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white brand-title-shadow"
					style={{ fontFamily: "Montserrat, Poppins, system-ui, -apple-system, 'Segoe UI', Roboto" }}
				>
					Your Tasks
				</motion.h1>

				<div className="flex items-center gap-3">
					{Object.keys(ACCENTS).map((c) => (
						<button
							key={c}
							onClick={() => setAccent(c)}
							className={`w-4 h-4 rounded-full ${ACCENTS[c].split(" ")[0]} ring-2 ${
								accent === c ? "ring-white" : "ring-transparent"
							}`}
						/>
					))}

					<motion.button
						onClick={() => setDark(!dark)}
						whileTap={{ scale: 0.95 }}
						className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-[#f7f3ef] dark:bg-[#111111] shadow-sm"
						aria-label="Toggle dark mode"
					>
						{dark ? (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="12" cy="12" r="3" fill="#f7f3ef" />
								<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#b0917a"/>
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f7f3ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#111827"/>
							</svg>
						)}
					</motion.button>

					<Link to="/" className="text-sm px-3 py-1 rounded-full border bg-white/5">Home</Link>
				</div>
			</div>

			{/* Task input component (centered, calm, Todoist-like) */}
			<div className="mb-8">
				<TaskInput onAdd={handleAddFromInput} />
			</div>

			{/* Toast */}
			{toast.show && (
				<div className="fixed right-4 top-6 z-50">
					<div className="px-4 py-2 rounded-md bg-emerald-500 text-white shadow">{toast.msg}</div>
				</div>
			)}

			{/* Stats */}
			<div className="flex gap-3 mb-8 text-sm">
				<span className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10">Total: {tasks.length}</span>
			</div>

			<div className="flex gap-3 mt-6 mb-6">
				<Link to="/tasks/pending" className="px-4 py-2 rounded-full bg-gray-800 text-white hover:opacity-90">Pending Tasks</Link>
				<Link to="/tasks/completed" className="px-4 py-2 rounded-full bg-green-600 text-white hover:opacity-90">Completed Tasks</Link>
			</div>

			{/* Today */}
			<h2 className="mb-3 font-medium">Today</h2>

			<AnimatePresence>
				{tasks.map((task) => (
					<motion.div
						key={task._id}
						layout
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, x: 80 }}
						className="flex items-center justify-between mb-3 p-4 rounded-xl bg-white/60 dark:bg-black/40 backdrop-blur"
					>
						<div className="flex items-center gap-3 w-full">
							<input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)} className="scale-110" />

							{editingId === task._id ? (
								<div className="flex items-center gap-2 w-full">
									<input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit(task)} className="flex-1 bg-transparent border-b outline-none px-2 py-1" autoFocus />
									<button onClick={() => saveEdit(task)} className="px-3 py-1 rounded-md bg-emerald-500 text-white text-sm">Save</button>
									<button onClick={() => setEditingId(null)} className="px-3 py-1 rounded-md bg-white/10 text-sm">Cancel</button>
								</div>
							) : (
								<div className="flex-1">
									<p className={task.completed ? "line-through opacity-60" : ""}>{task.title}</p>
									<div className="flex items-center gap-3">
										<p className="text-xs opacity-50">{new Date(task.createdAt).toLocaleString()}</p>
										{task.dueDate && <span className="text-xs px-2 py-1 rounded-md bg-yellow-100 text-yellow-800">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
									</div>
								</div>
							)}
						</div>

						<div className="flex gap-3 items-center">
							<button onClick={() => { setEditingId(task._id); setEditText(task.title); }} className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm" aria-label="Edit task">Edit</button>
							<button onClick={() => handleDelete(task._id)} className="px-3 py-1 rounded-md bg-rose-500/90 hover:bg-rose-500 text-white text-sm" aria-label="Delete task">Delete</button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
}
 
