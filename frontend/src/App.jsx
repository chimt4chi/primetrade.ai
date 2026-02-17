import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const url = "http://localhost:3000";

  console.log(todos);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${url}/todos`);
        if (!res.ok) throw new Error("something went wrong");
        const data = await res.json();
        setTodos([...data]);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      const response = await fetch(`${url}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await response.json();

      setTodos((prev) => [...prev, data]);
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    setInput("");
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTask = {
      ...todo,
      completed: !todo.completed,
    };

    // ✅ Update UI immediately
    setTodos((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));

    try {
      await fetch(`${url}/todos/${id}`, {
        method: "PUT", // better for partial update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    // setTodos(todos.filter((task) => task.id !== id));
    try {
      const response = await fetch(`${url}/todos/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      setTodos((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-red-500">hello</h1>

      <div className="">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center gap-2"
          action=""
        >
          <input
            className="border border-white rounded-md p-4 text-white"
            type="text"
            placeholder="enter todo..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            type="submit"
            className="text-white border border-white h-15 p-4 rounded-md"
          >
            +
          </button>
        </form>
      </div>

      {/* Display todos */}

      {loading ? (
        <h1>loading...</h1>
      ) : (
        <div>
          {todos.map((task, index) => (
            <div
              className="flex items-center justify-center gap-10 mt-5 text-white"
              key={task.id}
            >
              <span>{index + 1}.</span>
              <input
                checked={task.completed}
                type="checkbox"
                value={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span
                // onClick={() => toggleComplete(task.id)}
                className={`${task.completed ? "line-through text-red-400" : ""}`}
              >
                {task.text}
              </span>
              <div className="flex gap-2">
                {/* <button type="button" className="cursor-pointer">
                  📝
                </button> */}
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="cursor-pointer"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
