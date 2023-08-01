import { Request, Response } from "express";
import { Todo } from "../models/todo"; // Import the Todo interface and CRUD functions
import {
  createTodo as createTodoDB,
  getAllTodos as getAllTodosDB,
  getTodoById as getTodoByIdDB,
  updateTodo as updateTodoDB,
  deleteTodo as deleteTodoDB,
} from "../models/todo"; // Import the CRUD functions from todo.ts

// Function to handle errors and send error response
const handleError = (res: Response, error: Error): void => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

// Function to wrap try-catch block and call the specified function
const handleFunction = async (
  req: Request,
  res: Response,
  func: (req: Request, res: Response) => Promise<void>
): Promise<void> => {
  try {
    await func(req, res);
  } catch (error) {
    handleError(res, error as Error);
  }
};

export const getAllTodosHandler = (
  req: Request,
  res: Response
): Promise<void> =>
  handleFunction(req, res, async () => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const maxItemsPerPage =
      parseInt(req.query.maxItemsPerPage as string, 10) || 10;

    const paginatedTodos = await getAllTodosDB(page, maxItemsPerPage);
    res.json(paginatedTodos);
  });

export const getTodoByIdHandler = (
  req: Request,
  res: Response
): Promise<void> =>
  handleFunction(req, res, async () => {
    const { id } = req.params;
    const todo: Todo | null = await getTodoByIdDB(Number(id));
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

export const createTodoHandler = (req: Request, res: Response): Promise<void> =>
  handleFunction(req, res, async () => {
    const { title, description, completed } = req.body;
    const newTodo: Todo = await createTodoDB({
      title,
      description,
      completed,
      created_at: new Date(),
    });
    res.status(201).json(newTodo);
  });

export const updateTodoHandler = (req: Request, res: Response): Promise<void> =>
  handleFunction(req, res, async () => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const updatedTodo: Todo | null = await updateTodoDB(Number(id), {
      title,
      description,
      completed,
    });
    if (updatedTodo) {
      res.json(updatedTodo);
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });

export const deleteTodoHandler = (req: Request, res: Response): Promise<void> =>
  handleFunction(req, res, async () => {
    const { id } = req.params;
    const deleted: boolean = await deleteTodoDB(Number(id));
    if (deleted) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ message: "Todo not found" });
    }
  });
