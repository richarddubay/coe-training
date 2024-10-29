import { Router } from "express";
import { postSignUp } from "../controllers/auth";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth routes
 */
const router = Router();

// POST: Sign up a player (add)
/**
 * @openapi
 * /signup:
 *   post:
 *     description: Creates a new player.
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the created player.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
// Step 1: Just getting the basic route set up.
// router.route("/signup").post((req, res) => {
//   res.status(201).send("Signup successful");
// });
router.route("/signup").post(postSignUp);

export default router;
