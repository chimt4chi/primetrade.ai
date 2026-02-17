// const express = require("express");
// const app = express();
// const port = 3000;

// app.use(express.json());

// app.use((err, req, res, next) => {
//   console.log(new Date().toLocaleString(), err.message, req.method, req.url);
//   next();
// });

// app.get("/", (req, res) => {
//   return res.json("hello");
// });

// const todos = [{ id: 1, text: "todo 1", completed: false }];

// app.get("/todos", (req, res) => {
//   res.json(todos);
// });

// app.post("/todos", (req, res) => {
//   const { text } = req.body;
//   // console.log(text, req.body);

//   if (!text) return res.status(400).json({ error: "Please enter a todo" });

//   const newTodo = {
//     id: Date.now(),
//     text,
//     completed: false,
//   };

//   todos.push(newTodo);

//   return res.status(201).json({ msg: "new Todo created", todo: newTodo });
// });

// app.get("/todo/:id", (req, res) => {
//   const { id } = req.params;
//   const todo = todos.find((t) => t.id === parseInt(id));
//   // console.log(id, todo);

//   if (!todo)
//     return res
//       .status(404)
//       .json({ message: "Todo Not Found", error: "Not Found" });

//   // const todo = todos.map((t) => t.id === parseInt(id));
//   return res.status(200).json(todo);
// });

// app.delete("/todo/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = todos.findIndex((t) => t.id === id);

//   if (index === -1) {
//     return res.status(404).json({ error: "Could not find todo" });
//   }

//   const deletedTodo = todos.splice(index, 1);

//   // console.log(deletedTodo);

//   return res.status(200).json({
//     message: "Todo deleted",
//     todo: deletedTodo,
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todos",
});

// ✅ CREATE Todo
app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const [result] = await pool.query("INSERT INTO todos (text) VALUES (?)", [
      text,
    ]);

    const [newTodo] = await pool.query("SELECT * FROM todos WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newTodo[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ All Todos
app.get("/todos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ Single Todo
app.get("/todos/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE Todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;

    const [result] = await pool.query(
      "UPDATE todos SET text = ?, completed = ? WHERE id = ?",
      [text, completed, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const [updatedTodo] = await pool.query("SELECT * FROM todos WHERE id = ?", [
      req.params.id,
    ]);

    res.json(updatedTodo[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE Todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM todos WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
