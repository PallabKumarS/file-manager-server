import config from "@/config";
import prisma from "@/lib/prisma";
import type { USER } from "@prisma/client";
import bcrypt from "bcrypt";

const createUser = async (payload: USER) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds,
  );

  return prisma.uSER.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      subscriptionId: true,
    },
  });
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
