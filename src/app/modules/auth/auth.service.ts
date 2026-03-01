import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';
import {
  createToken,
  isJWTIssuedBeforePasswordChanged,
  verifyToken,
} from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../utils/prismaClient';
import { User } from '@prisma/client';

// register user here
const registerUser = async (payload: {
  name: string;
  password: string;
  email: string;
  profilePhoto?: string;
}): Promise<User> => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'This email is already taken !');
  }

  // hashing the password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds as string),
  );

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  if (!newUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong !');
  }

  return newUser;
};

// login user here
const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is active
  if (user.status !== 'ACTIVE') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated !');
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //checking if the password is correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  //create token and sent to the  client
  const jwtPayload = {
    userId: user.id,
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
  const user = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is active
  if (user.status !== 'ACTIVE') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated !');
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  //checking if the password is correct
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds as string),
  );

  await prisma.user.update({
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

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is active
  if (user.status !== 'ACTIVE') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account is deactivated !');
  }

  // checking if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  if (
    user.passwordChangedAt &&
    isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
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
  registerUser,
};
