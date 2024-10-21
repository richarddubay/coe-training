// Version 1
// import { Request, Response } from "express";
// import { comicBookModel } from "../models";

// const getComicBooks = async (req: Request, res: Response) => {
//   const comicBooks = await comicBookModel.getAllComicBooks();
//   res.json(comicBooks);
// };

// export { getComicBooks };

// Version 2
import { Request, Response } from "express";
import { comicBookModel } from "../models";

const deleteComicBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = parseInt(id);
  const deletedComicBook = await comicBookModel.deleteComicBook(numericId);
  res.status(204).send(deletedComicBook);
};

const getComicBooks = async (req: Request, res: Response) => {
  const comicBooks = await comicBookModel.getAllComicBooks();
  res.status(200).json(comicBooks);
};

const getComicBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = parseInt(id);
  const comicBook = await comicBookModel.getComicBookById(numericId);
  return res.status(200).json(comicBook);
};

const postComicBook = async (req: Request, res: Response) => {
  const newComicBook = await comicBookModel.postComicBook();
  return res.status(201).send(newComicBook);
};

const putComicBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const numericId = parseInt(id);
  const updatedComicBook = await comicBookModel.putComicBook(numericId);
  return res.status(200).send(updatedComicBook);
};

export {
  deleteComicBook,
  getComicBooks,
  getComicBookById,
  postComicBook,
  putComicBook,
};
