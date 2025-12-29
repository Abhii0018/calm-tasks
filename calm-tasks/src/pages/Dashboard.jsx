import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTasks, createTask, deleteTask, updateTask } from "../services/api";

const ACCENTS = {
	indigo: "bg-indigo-500 text-indigo-500 ring-indigo-400",
	emerald: "bg-emerald-500 text-emerald-500 ring-emerald-400",
	rose: "bg-rose-500 text-rose-500 ring-rose-400",
	amber: "bg-amber-500 text-amber-500 ring-amber-400",
};

export default function Dashboard() {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);
	const [text, setText] = useState("");
	const [dark, setDark] = useState(true);
	const [accent, setAccent] = useState("indigo");
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");
	const [addLoading, setAddLoading] = useState(false);
	const [addError, setAddError] = useState("");

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

	async function handleAdd() {
		if (!text.trim()) return;
		// require token before attempting to add
		if (!localStorage.getItem("token")) {
			setAddError("Please login to add tasks.");
			navigate('/login');
			return;
		}
		setAddError("");
		setAddLoading(true);
		try {
			const res = await createTask({ title: text });
			setTasks([res.data, ...tasks]);
			setText("");
		} catch (err) {
			console.error("Add task failed:", err);
			const msg = err.response?.data?.message || err.message || "Add failed";
			setAddError(msg);
			if (err.response?.status === 401 || /token|invalid/i.test(msg)) {
				setTimeout(() => navigate('/login'), 700);
			}
		} finally {
			setAddLoading(false);
		}
	}

	async function toggleTask(task) {
		const res = await updateTask(task._id, { completed: !task.completed });
		setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
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
				{/* Title on left */}
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

				{/* Right controls: accent picker, dark icon, Home */}
				<div className="flex items-center gap-3">
					{/* Accent picker */}
					{Object.keys(ACCENTS).map((c) => (
						<button
							key={c}
							onClick={() => setAccent(c)}
							className={`w-4 h-4 rounded-full ${ACCENTS[c].split(" ")[0]} ring-2 ${
								accent === c ? "ring-white" : "ring-transparent"
							}`}
						/>
					))}

					{/* Dark toggle icon (cream-white) */}
					<motion.button
						onClick={() => setDark(!dark)}
						whileTap={{ scale: 0.95 }}
						className="p-2 rounded-full border border-gray-300 dark:border-gray-600 bg-[#f7f3ef] dark:bg-[#111111] shadow-sm"
						aria-label="Toggle dark mode"
					>
						{dark ? (
							/* sun icon (cream) for dark -> light label */
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="12" cy="12" r="3" fill="#f7f3ef" />
								<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#b0917a"/>
							</svg>
						) : (
							/* moon icon for light -> dark */
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f7f3ef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#111827"/>
							</svg>
						)}
					</motion.button>

					{/* Home on the right-most */}
					<Link to="/" className="text-sm px-3 py-1 rounded-full border bg-white/5">Home</Link>
				</div>
			</div>

			{/* Stats */}
			<div className="flex gap-3 mb-8 text-sm">
				<span className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10">
					Total: {tasks.length}
				</span>
			</div>

			<div className="flex gap-3 mt-6 mb-6">
				<Link
					to="/tasks/pending"
					className="px-4 py-2 rounded-full bg-gray-800 text-white hover:opacity-90"
				>
					Pending Tasks
				</Link>
				<Link
					to="/tasks/completed"
					className="px-4 py-2 rounded-full bg-green-600 text-white hover:opacity-90"
				>
					Completed Tasks
				</Link>
			</div>

			{/* Input */}
			<div className="flex justify-center mb-8">
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleAdd()}
					placeholder="Write something calm..."
					className="
						w-full max-w-lg px-5 py-3 rounded-xl
						bg-white/70 dark:bg-black/40
						backdrop-blur
						border border-black/10 dark:border-white/10
						focus:ring-2 focus:outline-none
					"
				/>
				<div className="ml-3">
					<button
						onClick={handleAdd}
						disabled={addLoading}
						aria-busy={addLoading}
						className={`px-5 rounded-xl text-white ${ACCENTS[accent].split(" ")[0]} ${addLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
					>
						{addLoading ? 'Adding...' : 'Add'}
					</button>
					{addError && (
						<p className="text-xs text-rose-500 mt-2">{addError}</p>
					)}
				</div>
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
						className="
							flex items-center justify-between
							mb-3 p-4 rounded-xl
							bg-white/60 dark:bg-black/40
							backdrop-blur
						"
					>
						<div className="flex items-center gap-3 w-full">
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTask(task)}
								className="scale-110"
							/>

							{editingId === task._id ? (
								<input
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && saveEdit(task)}
									className="bg-transparent border-b flex-1 outline-none"
									autoFocus
								/>
							) : (
								<div className="flex-1">
									<p className={task.completed ? "line-through opacity-60" : ""}>
										{task.title}
									</p>
									<p className="text-xs opacity-50">
										{new Date(task.createdAt).toLocaleString()}
									</p>
								</div>
							)}
						</div>

						<div className="flex gap-3">
							<button
								onClick={() => {
									setEditingId(task._id);
									setEditText(task.title);
								}}
							>
								✏️
							</button>
							<button onClick={() => handleDelete(task._id)}>❌</button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
}


