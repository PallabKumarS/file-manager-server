import config from "@/config";
import prisma from "@/lib/prisma";
import type { USER } from "@prisma/client";
import bcrypt from "bcrypt";
import status from "http-status";
import { AppError } from "src/app/errors/AppError";

const createUserIntoDB = async (payload: {
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
      totalFiles: 0,
      totalFolders: 0,
    },
  });

  if (!newUser) {
    throw new AppError(status.BAD_REQUEST, "Something went wrong !");
  }

  return newUser;
};

const getUsersFromDB = async () => {
  return prisma.uSER.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      subscription: true,
      files: true,
      folders: true,
      totalFiles: true,
      totalFolders: true,
      updatedAt: true,
      isDeleted: true,
    },
  });
};

const getSingleUserFromDB = async (id: string) => {
  const user = await prisma.uSER.findUnique({
    where: { id, isDeleted: false },
    select: {
      subscription: true,
      files: true,
      folders: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      id: true,
      totalFiles: true,
      totalFolders: true,
      updatedAt: true,
      isDeleted: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserIntoDB = async (id: string, payload: { name: string }) => {
  const updatedUser = await prisma.uSER.update({
    where: { id },
    data: { name: payload.name },
  });

  if (!updatedUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  return updatedUser;
};

const deleteUserFromDB = async (id: string) => {
  const deletedUser = await prisma.uSER.update({
    where: { id },
    data: { isDeleted: true },
  });

  if (!deletedUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return deletedUser;
};

export const UserService = {
  createUser: createUserIntoDB,
  getUsers: getUsersFromDB,
  getSingleUser: getSingleUserFromDB,
  updateUser: updateUserIntoDB,
  deleteUser: deleteUserFromDB,
};
