import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { FileService } from "./file.service";

// Upload file (create)
const createFile = catchAsync(async (req, res) => {
  const result = await FileService.createFile(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully!",
    data: result,
  });
});

// Get files (optionally by folderId)
const getFiles = catchAsync(async (req, res) => {
  const { folderId } = req.query;

  const result = await FileService.getFiles(req.user.id, folderId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Files retrieved successfully!",
    data: result,
  });
});

// Update file (rename)
const updateFile = catchAsync(async (req, res) => {
  const result = await FileService.updateFile(
    req.user.id,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File updated successfully!",
    data: result,
  });
});

// Delete file (soft delete)
const deleteFile = catchAsync(async (req, res) => {
  const result = await FileService.deleteFile(
    req.user.id,
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File deleted successfully!",
    data: result,
  });
});

export const FileController = {
  createFile,
  getFiles,
  updateFile,
  deleteFile,
};
