import { Request, Response } from "express";
import { Todo } from "../models/todo"; // Import the Todo interface and CRUD functions
import {
  createTodo as createTodoDB,
  getAllTodos as getAllTodosDB,
  getTodoById as getTodoByIdDB,
  updateTodo as updateTodoDB,
  deleteTodo as deleteTodoDB,
} from "../models/todo"; // Import the CRUD functions from todo.ts

export async function getAllTodos(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const maxItemsPerPage =
      parseInt(req.query.maxItemsPerPage as string, 10) || 10;

    const paginatedTodos = await getAllTodosDB(page, maxItemsPerPage); // Call the getAllTodos function from the models
    res.json(paginatedTodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function getTodoById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const todo: Todo | null = await getTodoByIdDB(Number(id)); // Call the getTodoById function from todo.ts
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function createTodo(req: Request, res: Response): Promise<void> {
  const { title, description, completed } = req.body;
  try {
    const newTodo: Todo = await createTodoDB({
      title,
      description,
      completed,
      created_at: new Date(),
    }); // Call the createTodo function from todo.ts
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function updateTodo(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const updatedTodo: Todo | null = await updateTodoDB(Number(id), {
      title,
      description,
      completed,
    }); // Call the updateTodo function from todo.ts
    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function deleteTodo(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const deleted: boolean = await deleteTodoDB(Number(id)); // Call the deleteTodo function from todo.ts
    if (deleted) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
