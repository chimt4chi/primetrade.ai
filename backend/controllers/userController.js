const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );

    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userId = req.user.userId;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET name = ?, password = ? WHERE id = ?", [
        name,
        hashedPassword,
        userId,
      ]);
    } else {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [
        name,
        userId,
      ]);
    }

    const [updatedUser] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId],
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
