import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const error = validationResult(req);
  const hasError = !error.isEmpty();

  if (hasError) {
    return res
      .status(400)
      .json({ error: error.array({ onlyFirstError: true }) });
  } else {
    next();
  }
}
