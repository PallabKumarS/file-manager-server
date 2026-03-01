import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/AppError";
import { verifyToken } from "../modules/auth/auth.utils";
import type { Role } from "@prisma/client";
import prisma from "../../lib/prisma";

const auth = (
  ...requiredRoles: Role[]
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      // checking if the token is missing
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      // checking if the given token is valid
      const decoded = verifyToken(token, config.jwt_access_secret as string);
      const { role, email } = decoded;

      // checking if the user is exist
      const user = await prisma.uSER.findUnique({
        where: { email },
        select: { password: true, isDeleted: true },
      });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
      }

      // checking if the user is already deleted
      const isDeleted = user?.isDeleted;

      if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
      }

      req.user = decoded;
      next();
    },
  );
};

export default auth;
