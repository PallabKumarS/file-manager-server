import status from "http-status";
import sendResponse from "src/app/utils/sendResponse";
import { UserService } from "./user.service";
import catchAsync from "src/app/utils/catchAsync";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (_req, res) => {
  const result = await UserService.getUsers();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserService.getSingleUser(req.params.id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserService.updateUser(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User deleted successfully!",
    data: null,
  });
});
export const UserController = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
