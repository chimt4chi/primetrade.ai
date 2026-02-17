const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const todoController = require("../controllers/todoContoller");

router.post("/", authMiddleware, todoController.createTodo);
router.get("/", authMiddleware, todoController.getTodos);
router.get("/:id", authMiddleware, todoController.getTodoById);
router.put("/:id", authMiddleware, todoController.updateTodo);
router.delete("/:id", authMiddleware, todoController.deleteTodo);

module.exports = router;
