import request from "supertest";
import app from "../src/app";
import knex from "../src/config/database";

const testUser = {
  username: "marieTestTodo",
  password: "marieTestTodo",
};

let authToken: string;

beforeAll(async () => {
  // Migrate the database before running tests
  await knex.migrate.latest();

  // Register a test user and obtain the JWT token
  const response = await request(app).post("/api/auth/register").send(testUser);
  authToken = response.body.token;
});

afterAll(async () => {
  // Delete the registered test user
  await knex.raw("DELETE FROM users WHERE username = ?", [testUser.username]);

  // Close the database connection and stop the server after all tests
  await knex.destroy();
});

describe("TODO CRUD", () => {
  let todoId: number;

  it("should create a new TODO", async () => {
    const newTodo = {
      title: "Test Todo",
      description: "This is a test todo",
      completed: false,
    };

    const response = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.description).toBe(newTodo.description);
    expect(response.body.completed).toBe(newTodo.completed);

    // Save the todo ID for next tests
    todoId = response.body.id;
  });

  it("should get all TODOs", async () => {
    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("todos");
    expect(Array.isArray(response.body.todos)).toBe(true);
  });

  it("should get a single TODO by ID", async () => {
    const response = await request(app)
      .get(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", todoId);
  });

  it("should update a TODO", async () => {
    const updatedTodo = {
      title: "Updated Todo",
      description: "This is an updated test todo",
      completed: true,
    };

    const response = await request(app)
      .put(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedTodo);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", todoId);
    expect(response.body.title).toBe(updatedTodo.title);
    expect(response.body.description).toBe(updatedTodo.description);
    expect(response.body.completed).toBe(updatedTodo.completed);
  });

  it("should delete a TODO", async () => {
    const response = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Todo deleted successfully" });
  });
});
