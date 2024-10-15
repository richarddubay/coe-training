// Version 1
// import { Router } from "express";
// // import * as comicBookController from "../controllers/comic_books";
// import { getComicBooks } from "../controllers/comic_books";

// const router = Router();

// // router.route("/").get(comicBookController.getComicBooks);
// router.route("/").get(getComicBooks);

// export default router;

// Version 2
import { Router } from "express";
import {
  deleteComicBook,
  getComicBookById,
  getComicBooks,
  postComicBook,
  putComicBook,
} from "../controllers/comic_books";

/**
 * @swagger
 * tags:
 *   name: Comic Books
 *   description: Comic book routes
 */
const router = Router();

// DELETE a comic book by id
/**
 * @openapi
 * /comic_books/{id}:
 *   delete:
 *     description: Delete a comic book.
 *     tags: [Comic Books]
 *     responses:
 *       200:
 *         description: Returns a string that shows the deleted comic book info.
 */
router.route("/:id").delete(deleteComicBook);

// GET all comic books
/**
 * @openapi
 * /comic_books:
 *   get:
 *     description: Get a list of all the comic books.
 *     tags: [Comic Books]
 *     responses:
 *       200:
 *         description: Returns a JSON list of all the comic books.
 */
router.route("/").get(getComicBooks);

// GET a comic book by id
/**
 * @openapi
 * /comic_books/{id}:
 *   get:
 *     description: Get the information for a particular comic book by its id.
 *     tags: [Comic Books]
 *     responses:
 *       200:
 *         description: Returns the JSON info for a particular comic book.
 */
router.route("/:id").get(getComicBookById);

// POST a comic book (create)
/**
 * @openapi
 * /comic_books:
 *   post:
 *     description: Creates a new comic book.
 *     tags: [Comic Books]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the created comic book.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router.route("/").post(postComicBook);

// PUT a comic book (update a comic book by id)
/**
 * @openapi
 * /comic_books/{id}:
 *   put:
 *     description: Updates a particular comic book by its id.
 *     tags: [Comic Books]
 *     responses:
 *       200:
 *         description: Returns the JSON info for the updated comic book.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router.route("/:id").put(putComicBook);

export default router;
