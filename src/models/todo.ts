import knex from "../config/database";

/**
 * TODO
 * Add Pagination
 */

export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
}

// CREATE a new todo
export async function createTodo(todo: Todo): Promise<Todo> {
  const createdTodo = await knex.raw(
    `
    INSERT INTO todos (title, description, completed, created_at)
    VALUES (?, ?, ?, ?)
    RETURNING *
    `,
    [todo.title, todo.description, todo.completed, todo.created_at]
  );

  return createdTodo.rows[0];
}

export const getAllTodos = async (
  page: number,
  maxItemsPerPage: number
): Promise<{ todos: Todo[]; currentPage: number; totalPages: number }> => {
  const offset = (page - 1) * maxItemsPerPage;

  const totalCount = await knex
    .raw("SELECT COUNT(*) FROM todos")
    .then((result) => result.rows[0].count);
  const totalPages = Math.ceil(totalCount / maxItemsPerPage);

  const todos = await knex.raw("SELECT * FROM todos LIMIT ? OFFSET ?", [
    maxItemsPerPage,
    offset,
  ]);

  return {
    todos: todos.rows,
    currentPage: page,
    totalPages: totalPages,
  };
};

export const getTodoById = async (id: number): Promise<Todo | null> => {
  const todo = await knex.raw("SELECT * FROM todos WHERE id = ?", [id]);
  return todo.rows[0] || null;
};

export const updateTodo = async (
  id: number,
  updates: Partial<Todo>
): Promise<Todo | null> => {
  const updatedTodo = await knex.raw(
    `
    UPDATE todos
    SET title = ?, description = ?, completed = ?, updated_at = NOW()
    WHERE id = ?
    RETURNING *
    `,
    [updates.title, updates.description, updates.completed, id]
  );

  return updatedTodo.rows[0] || null;
};

export async function deleteTodo(id: number): Promise<boolean> {
  const result = await knex.raw("DELETE FROM todos WHERE id = ?", [id]);
  return result.rowCount > 0;
}
