import { comicBookModel } from "../../models";
import { mockRequest, mockResponse } from "../../test-utils/mockRequest";
import { deleteComicBook } from "../comic_books";
import { when } from "jest-when";

jest.mock("../../models/comic_books");

describe("Comic Books Controller", () => {
  describe("deleteComicBook", () => {
    it("should delete a comic book when a valid comic book id is provided", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const mockComicBook = {
        id: 1,
        title: "Avengers",
        issue_number: 1,
        publisher_id: 2,
        published_date: new Date("2018-05-02"),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      };

      when(comicBookModel.getComicBookById).calledWith(1).mockResolvedValue(mockComicBook);
      when(comicBookModel.deleteComicBook).calledWith(1).mockResolvedValue(mockComicBook);

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(comicBookModel.deleteComicBook).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        message: "Deleted comic book",
        comicBook: {
          id: mockComicBook.id,
          title: mockComicBook.title,
          issue_number: mockComicBook.issue_number,
          publisher_id: mockComicBook.publisher_id,
          published_date: mockComicBook.published_date,
          created_at: mockComicBook.created_at,
        },
      });
    });

    it("should return a message if the comic book does not exist", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      when(comicBookModel.getComicBookById).calledWith(1).mockResolvedValue(null);

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("No comic book with that id exists");
    });

    it("should return a 500 error with a specific error message if something goes wrong", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      const errorMessage = "You found an error! Congratulations!";
      when(comicBookModel.getComicBookById)
        .calledWith(1)
        .mockResolvedValue(Promise.reject(new Error(errorMessage)));

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: errorMessage,
      });
    });

    it("should return a 500 error with a generic error message if something that isn't an error goes wrong", async () => {
      // Arrange
      const req = mockRequest({ params: { id: 1 } });
      const res = mockResponse();

      when(comicBookModel.getComicBookById)
        .calledWith(1)
        .mockResolvedValue(Promise.reject("Unexpected Error"));

      // Act
      await deleteComicBook(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: "An unknown error occurred.",
      });
    });
  });
});
