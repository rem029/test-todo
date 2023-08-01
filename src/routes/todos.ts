import { Router } from "express";
import * as todosController from "../controllers/todosController";
import { authenticateJWT } from "../middleware/authMiddleware"; // Import the authenticateJWT middleware

const router = Router();

router.get("/todos", authenticateJWT, todosController.getAllTodosHandler);
router.get("/todos/:id", authenticateJWT, todosController.getTodoByIdHandler);
router.post("/todos", authenticateJWT, todosController.createTodoHandler);
router.put("/todos/:id", authenticateJWT, todosController.updateTodoHandler);
router.delete("/todos/:id", authenticateJWT, todosController.deleteTodoHandler);

export default router;
