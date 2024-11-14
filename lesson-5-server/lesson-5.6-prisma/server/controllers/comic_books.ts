// Version 1
// import { Request, Response } from "express";
// import { comicBookModel } from "../models";

// const getComicBooks = async (req: Request, res: Response) => {
//   const comicBooks = await comicBookModel.getAllComicBooks();
//   res.json(comicBooks);
// };

// export { getComicBooks };

// Version 2
// import { Request, Response } from "express";
// import { comicBookModel } from "../models";

// const deleteComicBook = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const numericId = parseInt(id);
//   const deletedComicBook = await comicBookModel.deleteComicBook(numericId);
//   res.status(204).send(deletedComicBook);
// };

// const getComicBooks = async (req: Request, res: Response) => {
//   const comicBooks = await comicBookModel.getAllComicBooks();
//   res.status(200).json(comicBooks);
// };

// const getComicBookById = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const numericId = parseInt(id);
//   const comicBook = await comicBookModel.getComicBookById(numericId);
//   return res.status(200).json(comicBook);
// };

// const postComicBook = async (req: Request, res: Response) => {
//   const newComicBook = await comicBookModel.postComicBook();
//   return res.status(201).send(newComicBook);
// };

// const putComicBook = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const numericId = parseInt(id);
//   const updatedComicBook = await comicBookModel.putComicBook(numericId);
//   return res.status(200).send(updatedComicBook);
// };

// export {
//   deleteComicBook,
//   getComicBooks,
//   getComicBookById,
//   postComicBook,
//   putComicBook,
// };

// Version 3 - With Prisma
import { Request, Response } from "express";
import { comicBookModel } from "../models";

const deleteComicBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const comicBook = await comicBookModel.getComicBookById(numericId);

    if (comicBook) {
      const deletedComicBook = await comicBookModel.deleteComicBook(numericId);
      res.status(204).json({
        message: "Deleted comic book",
        comicBook: {
          id: deletedComicBook.id,
          title: deletedComicBook.title,
          issue_number: deletedComicBook.issue_number,
          publisher_id: deletedComicBook.publisher_id,
          published_date: deletedComicBook.published_date,
          created_at: deletedComicBook.created_at,
        },
      });
    } else {
      res.status(404).send("No driver with that id exists");
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getComicBooks = async (req: Request, res: Response) => {
  try {
    const comicBooks = await comicBookModel.getAllComicBooks();
    res.status(200).json(comicBooks);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getComicBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const comicBook = await comicBookModel.getComicBookById(numericId);
    if (comicBook) {
      res.status(200).json(comicBook);
    } else {
      res.status(404).json({
        message: "A comic book with that id could not be found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const postComicBook = async (req: Request, res: Response) => {
  try {
    const { title, issue_number, publisher_id, published_date } = req.body;

    const newComicBook = {
      title,
      issue_number,
      publisher_id,
      published_date,
    };

    if (
      !newComicBook.title ||
      !newComicBook.issue_number ||
      !newComicBook.publisher_id ||
      !newComicBook.published_date
    ) {
      return res
        .status(400)
        .send(
          "A comic book needs a title, issue number, publisher id, and published date."
        );
    }

    const comicBookResponse = await comicBookModel.postComicBook(newComicBook);

    return res.status(201).json({
      message: "Comic book created successfully.",
      comicBook: comicBookResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error adding the new comic book: ${error}`,
      error: error,
    });
  }
};

const putComicBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const { title, issue_number, publisher_id, published_date } = req.body;

    const comicBookToUpdate = {
      title,
      issue_number,
      publisher_id,
      published_date,
    };

    const comicBookResponse = await comicBookModel.putComicBook(
      numericId,
      comicBookToUpdate
    );
    return res.status(200).json({
      message: "Comic book updated successfully",
      comicBook: comicBookResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error updating the comic book: ${error}`,
      error: error,
    });
  }
};

export {
  deleteComicBook,
  getComicBooks,
  getComicBookById,
  postComicBook,
  putComicBook,
};
