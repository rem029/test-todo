import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { DecodedUser } from "../types/auth";

dotenv.config(); // Load environment variables from .env file

const jwtSecret = process.env.JWT_SECRET || "default_secret_key";

// Verify the JWT token in the Authorization header
export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    const user = decoded as DecodedUser;

    req.user = user; // Store the decoded token data in the request object for later use
    next();
  });
}
