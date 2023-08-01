import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import todosRoutes from "./routes/todos";
import { loggerMiddleware } from "./middleware/logger";
import authRoutes from "./routes/auth"; // Import the auth routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.use("/api", authRoutes); // Include the auth routes before todos routes
app.use("/api", todosRoutes);

// Handle 404 Not Found
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler middleware
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;
