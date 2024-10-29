import { Request, Response } from "express";
import { accountModel } from "../models";
import { generateAccessToken } from "../utils/auth";
import bcrypt from "bcryptjs";

const postSignUp = async (req: Request, res: Response) => {
  try {
    // Step 1: Validate the email and password
    // Step 2: Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Step 3: Create the account
    const newAccount = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      identifier: req.body.identifier,
      password: hashedPassword,
    };
    const account = await accountModel.postAccount(newAccount);
    // Step 4: Generate an access token
    const accessToken = await generateAccessToken(account.id);
    // Step 5: Return the response
    return res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({
      message: `There was an error creating a new account: ${error}`,
      error,
    });
  }
};

export { postSignUp };
