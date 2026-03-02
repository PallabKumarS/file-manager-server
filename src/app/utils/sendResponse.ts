import type { Response } from "express";

export type TMeta = {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T | null;
  meta?: TMeta | null;
};

const sendResponse = <T>(res: Response, data: TResponse<T>): void => {
  const response: TResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data ?? null,
    meta: data.meta ?? null,
  };

  res.status(data?.statusCode).json(response);
};

export default sendResponse;
