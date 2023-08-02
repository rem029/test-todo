import { Request, Response } from "express";

// Function to handle errors and send error response
export const handleError = (res: Response, error: Error): void => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

// Function to wrap try-catch block and call the specified function
export const handleFunction = async (
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
