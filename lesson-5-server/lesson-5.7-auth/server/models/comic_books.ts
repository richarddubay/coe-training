import { prisma } from "../utils/prisma";
import type { comic_books as ComicBooks } from "@prisma/client";

type ComicBookType = Omit<
  ComicBooks,
  "created_at" | "deleted_at" | "id" | "updated_at"
>;

export const deleteComicBook = async (comicBookId: number) => {
  // return `Deleted comic book with id: ${comicBookId}`;
  // This is an option we could use where we would not actually delete the record but just update the
  // deleted_at date instead. This is probably the more RIGHT way to do it.
  // const deletedComicBook = await prisma.comic_books.update({
  //   where: {
  //     id: comicBookId,
  //   },
  //   data: {
  //     ...comicBook,
  //     deleted_at: new Date();
  //   }
  // });
  // return deletedComicBook;
  const deletedComicBook = await prisma.comic_books.delete({
    where: {
      id: comicBookId,
    },
  });
  return deletedComicBook;
};

export const getAllComicBooks = async () => {
  // return [
  //   {
  //     id: 1,
  //     title: "Avengers",
  //     issue_number: 1,
  //     publisher_id: 2,
  //     published_date: "2018-05-02",
  //     created_at: new Date(),
  //   },
  //   {
  //     id: 2,
  //     title: "Batman",
  //     issue_number: 1,
  //     publisher_id: 1,
  //     published_date: "2016-06-15",
  //     created_at: new Date(),
  //   },
  // ];
  const comicBooks = await prisma.comic_books.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return comicBooks;
};

export const getComicBookById = async (comicBookId: number) => {
  // return [
  //   {
  //     id: comicBookId,
  //     title: "Avengers",
  //     issue_number: 1,
  //     publisher_id: 2,
  //     published_date: "2018-05-02",
  //     created_at: new Date(),
  //   },
  // ];
  const comicBook = await prisma.comic_books.findUnique({
    where: {
      id: comicBookId,
    },
  });
  return comicBook;
};

export const postComicBook = async (comicBook: ComicBookType) => {
  // return `Created comic book`;
  const newComicBook = await prisma.comic_books.create({
    data: {
      ...comicBook,
      created_at: new Date(),
    },
  });
  return newComicBook;
};

export const putComicBook = async (
  comicBookId: number,
  comicBook: ComicBookType
) => {
  // return `Updated comic book with id: ${comicBookId}`;
  const updatedComicBook = await prisma.comic_books.update({
    where: {
      id: comicBookId,
    },
    data: {
      ...comicBook,
      updated_at: new Date(),
    },
  });
  return updatedComicBook;
};
