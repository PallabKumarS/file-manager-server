import { AppError } from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import type { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// login user here
const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  // checking if the user is exist
  const user = await prisma.uSER.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      password: true,
      isDeleted: true,
      id: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  //checking if the password is correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not match");
  }

  // create token and sent to the  client
  const jwtPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return { accessToken, refreshToken };
};

// change password here
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
): Promise<null> => {
  // checking if the user is exist
  const user = await prisma.uSER.findUnique({
    where: {
      email: userData.email,
    },
    select: {
      password: true,
      isDeleted: true,
      id: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  //checking if the password is correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not match");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds as string),
  );

  await prisma.uSER.update({
    where: {
      email: userData.email,
    },
    data: {
      password: newHashedPassword,
    },
  });

  return null;
};

// refresh token here service here
const refreshToken = async (token: string): Promise<string> => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await prisma.uSER.findUnique({
    where: {
      email,
    },
    select: {
      password: true,
      isDeleted: true,
      id: true,
      role: true,
      email: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return accessToken;
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
};
