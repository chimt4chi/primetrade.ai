const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

// Save token in localStorage after login
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API request failed");
  return data;
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getTodos = async () => {
  const res = await fetch(`${API_BASE}/todos`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
};

export const addTodo = async (text) => {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add todo");
  return data;
};

export const toggleTodo = async (id, text, completed) => {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ text, completed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update todo");
  return data;
};

export const deleteTodo = async (id) => {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete todo");
  return data;
};
