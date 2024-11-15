import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // This will be useful for testing later.
  if (process.env.NODE_ENV === "test") {
    res.locals.user_id = 1;
    return next();
  }

  // If you happen to have trouble getting your auth middleware to work in your app.ts file, this is one way
  // you could potentially bypass that problem.
  // if (req.path.startsWith("/auth")) {
  //   return next(); // Skip authMiddleware for /auth routes
  // }

  const authToken = req.headers.authorization?.split(" ")[1];

  if (authToken) {
    try {
      const token = await verifyAccessToken(authToken);
      if (token) {
        res.locals.user_id = token.sub;
        return next();
      }
    } catch (error) {
      return res.status(401).send("Missing auth token");
    }
  }
  return res.status(401).send("Missing auth token");
}
