import { useEffect, useState } from "react";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "../api";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const newTodo = await addTodo(input);
      setTodos((prev) => [...prev, newTodo]);
      setInput("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const updated = await toggleTodo(todo.id, todo.text, !todo.completed);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-16">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">My Todos</h2>
        <p className="text-sm text-gray-400 mb-6">
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
          />
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg font-medium px-4 rounded-lg transition cursor-pointer"
            type="submit"
          >
            +
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No tasks yet. Add one above!
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo, i) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 px-3 py-2.5 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-xs text-gray-300 w-4">{i + 1}</span>
                <input
                  type="checkbox"
                  checked={Boolean(todo.completed)}
                  onChange={() => toggleComplete(todo)}
                  className="accent-indigo-500 cursor-pointer"
                />
                <span
                  className={`flex-1 text-sm ${todo.completed ? "line-through text-gray-300" : "text-gray-700"}`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTask(todo.id)}
                  className="text-gray-300 hover:text-red-400 transition text-base cursor-pointer"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
