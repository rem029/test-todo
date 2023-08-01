import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import knex from "../config/database";

dotenv.config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
const saltRounds = 10;

const errorInvalidCredentials = "Authentication failed: Invalid credentials";
const errorUsernameRequired = "Username is required";
const errorPasswordRequired = "Password is required";
const errorUsernameAndPasswordRequired = "Username and password are required";
const errorUsernameExists = "Username already exists";
const errorFailedToRegister = "Failed to register user";
const errorFailedToAuthenticate = "Failed to authenticate user";

router.post("/auth/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return res.status(400).json({ error: errorUsernameAndPasswordRequired });
  }

  if (!username) return res.status(400).json({ error: errorUsernameRequired });
  if (!password) return res.status(400).json({ error: errorPasswordRequired });

  try {
    // Check if the user exists
    const existingUser = await knex.raw(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: errorUsernameExists });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Register the new user
    const insertUserQuery =
      "INSERT INTO users (username, password) VALUES (?, ?) RETURNING id";
    const newUser = await knex.raw(insertUserQuery, [username, hashedPassword]);
    const userId = newUser.rows[0].id;

    // Generate a JWT token and send it as response
    const token = jwt.sign({ id: userId, username }, jwtSecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ id: userId, username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: errorFailedToRegister });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: errorUsernameRequired });
  }

  try {
    // Fetch the user
    const getUserQuery =
      "SELECT id, username, password FROM users WHERE username = ?";
    const user = await knex.raw(getUserQuery, [username]);

    if (!user.rows.length) {
      return res.status(401).json({ error: errorInvalidCredentials });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: errorInvalidCredentials });
    }

    // Generate a JWT token and send it as response
    const token = jwt.sign({ id: user.rows[0].id, username }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ id: user.rows[0].id, username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: errorFailedToAuthenticate });
  }
});

export default router;
