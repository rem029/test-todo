import { Router } from "express";
import * as todosController from "../controllers/todosController";
import { authenticateJWT } from "../middleware/authMiddleware"; // Import the authenticateJWT middleware

const router = Router();

router.get("/todos", authenticateJWT, todosController.getAllTodos);
router.get("/todos/:id", authenticateJWT, todosController.getTodoById);
router.post("/todos", authenticateJWT, todosController.createTodo);
router.put("/todos/:id", authenticateJWT, todosController.updateTodo);
router.delete("/todos/:id", authenticateJWT, todosController.deleteTodo);

export default router;
