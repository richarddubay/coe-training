import { Router } from "express";

const router = Router();

router.route("/").get((req, res) => {
  res.send("You have gotten all the comic books!");
});

export default router;
