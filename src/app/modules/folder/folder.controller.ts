import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { FolderService } from "./folder.service";

const createFolder = catchAsync(async (req, res) => {
  const result = await FolderService.createFolder(req.user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Folder created successfully!",
    data: result,
  });
});

const getFolders = catchAsync(async (req, res) => {
  const result = await FolderService.getFolders(req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folders retrieved successfully!",
    data: result,
  });
});

const updateFolder = catchAsync(async (req, res) => {
  const result = await FolderService.updateFolder(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder updated successfully!",
    data: result,
  });
});

const deleteFolder = catchAsync(async (req, res) => {
  const result = await FolderService.deleteFolder(
    req.user.id,
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Folder deleted successfully!",
    data: result,
  });
});

export const FolderController = {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
};
