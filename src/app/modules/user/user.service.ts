import config from "@/config";
import prisma from "@/lib/prisma";
import type { USER } from "@prisma/client";
import bcrypt from "bcrypt";
import status from "http-status";
import { AppError } from "src/app/errors/AppError";

const createUser = async (payload: {
  name: string;
  password: string;
  email: string;
}): Promise<Omit<USER, "password">> => {
  // checking if the user is exist
  const user = await prisma.uSER.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(status.CONFLICT, "This email is already taken !");
  }

  const freeSubscription = await prisma.sUBSCRIPTIONS.findFirst({
    where: {
      type: "FREE",
    },
  });

  // hashing the password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds as string),
  );

  const newUser = await prisma.uSER.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      subscriptionId: freeSubscription?.id as string,
    },
  });

  if (!newUser) {
    throw new AppError(status.BAD_REQUEST, "Something went wrong !");
  }

  return newUser;
};

const getUsers = async () => {
  return prisma.uSER.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      subscription: true,
    },
  });
};

export const UserService = {
  createUser,
  getUsers,
};
