import { Request, Response } from "express";
import { accountModel } from "../models";
import { prisma } from "../utils/prisma";

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const account = await prisma.account.findUnique({
      where: {
        id: numericId,
      },
    });
    if (account) {
      const deletedAccount = await accountModel.deleteAccount(numericId);
      res.status(204).json({
        message: "Deleted account",
        account: {
          id: deletedAccount.id,
          first_name: deletedAccount.first_name,
          last_name: deletedAccount.last_name,
          identifier: deletedAccount.identifier,
          created_at: deletedAccount.created_at,
        },
      });
    } else {
      res.send("No account with that id exists");
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountModel.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const account = await accountModel.getAccountById(numericId);
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({
        message: "An account with that id could not be found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const postAccount = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, identifier, password } = req.body;
    const newAccount = {
      first_name,
      last_name,
      identifier,
      password,
    };

    if (!newAccount.first_name || !newAccount.last_name) {
      return res.status(400).send("An account needs a first and last name.");
    }

    const accountResponse = await accountModel.postAccount(newAccount);

    return res.status(201).json({
      message: "Account created successfully",
      account: accountResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error adding the new account: ${error}`,
      error: error,
    });
  }
};

const putAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    const { first_name, last_name, identifier, password } = req.body;

    const accountToUpdate = {
      first_name,
      last_name,
      identifier,
      password,
    };

    const accountResponse = await accountModel.putAccount(
      numericId,
      accountToUpdate
    );

    return res.status(200).json({
      message: "Account updated successfully",
      account: accountResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: `There was an error updating the account: ${error}`,
      error: error,
    });
  }
};

export { deleteAccount, getAccounts, getAccountById, postAccount, putAccount };
