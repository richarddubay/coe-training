import { Router } from "express";
// import * as comicBookController from "../controllers/comic_books";
import { getComicBooks } from "../controllers/comic_books";

const router = Router();

// router.route("/").get(comicBookController.getComicBooks);
router.route("/").get(getComicBooks);

export default router;
