import { prisma } from "../utils/prisma";
import type { account as Account } from "@prisma/client";

type AccountType = Omit<
  Account,
  "created_at" | "deleted_at" | "id" | "updated_at"
>;

export const deleteAccount = async (accountId: number) => {
  const deletedAccount = await prisma.account.delete({
    where: {
      id: accountId,
    },
  });
  return deletedAccount;
};

export const getAllAccounts = async () => {
  const accounts = await prisma.account.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      identifier: true,
      created_at: true,
      deleted_at: true,
      updated_at: true,
    },
  });
  return accounts;
};

export const getAccountById = async (accountId: number) => {
  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  });
  return account;
};

export const postAccount = async (account: AccountType) => {
  const newAccount = await prisma.account.create({
    data: {
      ...account,
      created_at: new Date(),
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      identifier: true,
      password: true,
      created_at: true,
    },
  });
  return newAccount;
};

export const putAccount = async (accountId: number, account: AccountType) => {
  const updatedAccount = await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      ...account,
      updated_at: new Date(),
    },
  });
  return updatedAccount;
};
