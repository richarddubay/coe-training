import { NextFunction, Request, Response } from "express";

export async function testMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(200).send("Used the test middleware");
}
