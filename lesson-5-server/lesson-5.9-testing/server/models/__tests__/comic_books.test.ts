import { comicBookModel } from "..";
import { prismaForTests } from "../../test-utils/prisma";
import { prisma } from "../../utils/prisma";

jest.mock("@prisma/client");

describe("Comic Books Model", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book", async () => {
      // Arrange
      const comic_book = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        delete: jest.fn().mockResolvedValue(comic_book),
      };

      // Act
      const result = await comicBookModel.deleteComicBook(1);

      // Assert
      expect(prisma.comic_books.delete).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
        })
      );
      expect(result).toEqual(comic_book);
    });
  });

  describe("getAllComicBooks", () => {
    it("should get all comic books", async () => {
      // Arrange
      const comic_books = [
        {
          id: 1,
          title: "Avengers",
          issue_number: 1,
          publisher_id: 2,
          published_date: new Date("2018-05-02"),
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
        },
        {
          id: 2,
          title: "Batman",
          issue_number: 1,
          publisher_id: 1,
          published_date: new Date("2016-06-15"),
          created_at: new Date(),
          updated_at: null,
          deleted_at: null,
        },
      ];
      prismaForTests.comic_books = {
        findMany: jest.fn().mockResolvedValue(comic_books),
      };

      // Act
      const result = await comicBookModel.getAllComicBooks();

      // Assert
      expect(prisma.comic_books.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            id: "asc",
          },
        })
      );
      expect(result).toEqual(comic_books);
    });
  });

  describe("getComicBookById", () => {
    it("should get a comic book by id", async () => {
      // Arrange
      const comic_book = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        findUnique: jest.fn().mockResolvedValue(comic_book),
      };

      // Act
      const result = await comicBookModel.getComicBookById(1);

      // Assert
      expect(prisma.comic_books.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
        })
      );
      expect(result).toEqual(comic_book);
    });
  });

  describe("postComicBook", () => {
    it("should create a comic book", async () => {
      // Arrange
      const comicBook = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };
      prismaForTests.comic_books = {
        create: jest.fn().mockResolvedValue(comicBook),
      };

      // Act
      const result = await comicBookModel.postComicBook(comicBook);

      // Assert
      expect(prisma.comic_books.create).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            ...comicBook,
            created_at: new Date(),
          },
        })
      );
      expect(result).toEqual(comicBook);
    });
  });

  describe("putComicBook", () => {
    it("should update a comic book", async () => {
      // Arrange
      const comicBook = {
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
      };
      prismaForTests.comic_books = {
        update: jest.fn().mockResolvedValue(comicBook),
      };

      // Act
      const result = await comicBookModel.putComicBook(1, comicBook);

      // Assert
      expect(prisma.comic_books.update).toHaveBeenCalledTimes(1);
      expect(prisma.comic_books.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 1,
          },
          data: {
            ...comicBook,
            updated_at: new Date(),
          },
        })
      );
      expect(result).toEqual(comicBook);
    });
  });
});
