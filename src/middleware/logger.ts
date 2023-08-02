import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, url, query, body } = req;
  const start = Date.now();

  // Store the original response.send function
  const originalSend = res.send;

  // Create a function to intercept the response data
  res.send = function (data: any): Response<any, Record<string, any>> {
    // Restore the original response.send function
    res.send = originalSend;

    // Calculate the server response time
    const end = Date.now();
    const responseTime = end - start;

    // Get the current date and time
    const now = new Date();
    const dateTime = now.toISOString();

    console.log(
      `${dateTime} - ${method} ${url} | Query:`,
      query,
      ` | Body:`,
      body,
      ` | Response Time:`,
      `${responseTime}ms`,
      "\n",
      `Response:`,
      data,
      "\n"
    );

    // Send the response data as usual
    return originalSend.apply(res, arguments as any);
  };

  next();
};
