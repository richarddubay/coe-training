import { Request, Response } from "express";
import { accountModel } from "../models";
import { generateAccessToken } from "../utils/auth";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";

const postSignIn = async (req: Request, res: Response) => {
  try {
    // Get the email and password
    const { identifier, password } = req.body;

    // Get the account from their email
    const account = await prisma.account.findUnique({
      where: {
        identifier: identifier,
      },
    });

    // If there is an account, check its password.
    // If the password matches, generate an access token for them (sign them in).
    // If the password doesn't match, return a 404.
    if (account) {
      const passwordMatch = await bcrypt.compare(password, account.password);
      if (passwordMatch) {
        const accessToken = await generateAccessToken(account.id);
        return res.status(200).json({ accessToken });
      }
    }
    return res
      .status(404)
      .send("Account identifier or password was incorrect.");
  } catch (error) {
    res.status(500).json({
      message: `There was an error signing in: ${error}`,
      error,
    });
  }
};

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

export { postSignIn, postSignUp };
