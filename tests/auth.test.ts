import request from "supertest";
import app from "../src/app";
import knex from "../src/config/database";

const userName = "marieTest";
const userPassword = "marieTestPW";

describe("Authentication Routes", () => {
  // Store the user ID for cleanup
  let userId: number;

  const registerUser = async (
    userData: {
      username: string;
      password: string;
    },
    saveId?: boolean
  ) => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    if (saveId) userId = response.body.id;

    return response;
  };

  const cleanupDatabase = async () => {
    if (userId) {
      await knex("users").where("id", userId).delete();
    }
  };

  afterAll(async () => {
    // Clean up the test database
    await cleanupDatabase();
    await knex.destroy(); // Close the database connection
  });

  test("should register a new user", async () => {
    const userData = {
      username: userName,
      password: userPassword,
    };

    const response = await registerUser(userData, true);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("token");
  });

  test("should fail to register a user with missing username", async () => {
    const userData = {
      password: userPassword,
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Username is required");
  });

  test("should fail to register a user with missing password", async () => {
    const userData = {
      username: userName,
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Password is required");
  });

  test("should fail to register a user with an existing username", async () => {
    const userData = {
      username: userName,
      password: userPassword,
    };

    await registerUser(userData);

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error", "Username already exists");
  });

  test("should log in with valid credentials", async () => {
    const userData = {
      username: userName,
      password: userPassword,
    };

    const response = await request(app).post("/api/auth/login").send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("token");
  });

  test("should fail to log in with invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: userName,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "error",
      "Authentication failed: Invalid credentials"
    );
  });
});
