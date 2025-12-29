import axios from "axios";

/**
 * Base Axios instance
 */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * 🔐 Axios Interceptor
 * Automatically attaches JWT token to every request
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- AUTH APIs ----------
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// ---------- TASK APIs (Protected) ----------
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

export default API;
