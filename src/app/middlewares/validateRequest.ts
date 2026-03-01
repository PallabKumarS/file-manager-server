import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

const validateRequest = (schema: ZodObject) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      await schema.parseAsync({
        body: req.body,
        cookies: req?.cookies,
      });

      next();
    },
  );
};

export default validateRequest;
