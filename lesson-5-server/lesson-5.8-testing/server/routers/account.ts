// Account Router
import { Router } from "express";
import { param } from "express-validator";
import {
  deleteAccount,
  getAccountById,
  getAccounts,
  postAccount,
  putAccount,
} from "../controllers/account";
// Could also do this import as:
// import * as accountController from '../controllers/account';
// And then you can use it like:
// router.route("/").get(accountController.getAccounts);
import { validate } from "../middleware/validate";

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account routes
 */
const router = Router();

// DELETE an account by id
/**
 * @openapi
 * /account/{id}:
 *   delete:
 *     description: Delete an account.
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns a string that shows the deleted accounts id, first name, and last name.
 */
router
  .route("/:id")
  .delete(
    param("id").isNumeric().withMessage("You need a numeric id"),
    validate,
    deleteAccount
  );

// GET all accounts
/**
 * @openapi
 * /account:
 *   get:
 *     description: Get a list of all the accounts
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns a JSON list of all the accounts including id, first name, and last name.
 */
router.route("/").get(getAccounts);

// GET an account by id
/**
 * @openapi
 * /account/{id}:
 *   get:
 *     description: Get the account information for one particular account by id.
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns the JSON info for one account including id, first name, and last name.
 */
router
  .route("/:id")
  .get(
    param("id").isNumeric().withMessage("You need a numeric id"),
    validate,
    getAccountById
  );

// POST an account (add)
/**
 * @openapi
 * /account:
 *   post:
 *     description: Creates a new account.
 *     tags: [Account]
 *     responses:
 *       201:
 *         description: Returns the JSON info for the created account including id, first name, and last name.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router.route("/").post(postAccount);

// PUT an account (update an account by id)
/**
 * @openapi
 * /account:
 *   put:
 *     description: Updates a particular account by its id.
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Returns the JSON info for the updated account including id, first name, and last name.
 *       500:
 *         description: Returns error information if the API calls fails.
 */
router
  .route("/:id")
  .put(
    param("id").isNumeric().withMessage("You need a numeric id"),
    validate,
    putAccount
  );

export default router;
