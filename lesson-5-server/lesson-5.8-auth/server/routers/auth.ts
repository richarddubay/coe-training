import { Router } from "express";
import { postSignIn, postSignUp } from "../controllers/auth";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth routes
 */
const router = Router();

// POST: Sign in a person
/**
 * @openapi
 * /signin:
 *   post:
 *     description: Signs in a person.
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the signed in account.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
// router.route("/signin").post((req, res) => {
//   res.status(201).send("Signin successful");
// });
router.route("/signin").post(postSignIn);

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
