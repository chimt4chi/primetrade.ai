import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "../api";

export default function Dashboard() {
  const { user } = useOutletContext();
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

  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.length - completed;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Good day, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Here's what's on your list today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total", value: todos.length, color: "text-gray-800" },
          { label: "Pending", value: pending, color: "text-amber-500" },
          { label: "Done", value: completed, color: "text-green-500" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-xl px-5 py-4"
          >
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Todo card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">My Tasks</h2>

        {/* Add todo */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
          />
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium px-4 rounded-lg transition cursor-pointer"
            type="submit"
          >
            +
          </button>
        </form>

        {/* List */}
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
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
                  className="text-gray-300 hover:text-red-400 transition cursor-pointer"
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
