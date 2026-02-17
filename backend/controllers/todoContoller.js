const pool = require("../config/db");

// CREATE Todo
exports.createTodo = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const user_id = req.user.userId; // ✅ matches JWT payload

    const [result] = await pool.query(
      "INSERT INTO todos (text, user_id) VALUES (?, ?)", // ✅ includes user_id column
      [text, user_id],
    );

    const [newTodo] = await pool.query("SELECT * FROM todos WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(newTodo[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET All Todos
exports.getTodos = async (req, res) => {
  try {
    // ✅ only returns todos for the logged-in user
    const [rows] = await pool.query("SELECT * FROM todos WHERE user_id = ?", [
      req.user.userId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Single Todo
exports.getTodoById = async (req, res) => {
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
};

// UPDATE Todo
exports.updateTodo = async (req, res) => {
  try {
    const { text, completed } = req.body;

    const [result] = await pool.query(
      "UPDATE todos SET text = ?, completed = ? WHERE id = ? AND user_id = ?", // ✅ ownership check
      [text, completed, req.params.id, req.user.userId],
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
};

// DELETE Todo
exports.deleteTodo = async (req, res) => {
  try {
    const [result] = await pool.query(
      // ✅ pool.query restored
      "DELETE FROM todos WHERE id = ? AND user_id = ?", // ✅ ownership check
      [req.params.id, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
