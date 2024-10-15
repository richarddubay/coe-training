import { Request, Response } from "express";
import { comicBookModel } from "../models";

const getComicBooks = async (req: Request, res: Response) => {
  const comicBooks = await comicBookModel.getAllComicBooks();
  res.json(comicBooks);
};

export { getComicBooks };
