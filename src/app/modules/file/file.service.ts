import prisma from "@/lib/prisma";
import type { FileType } from "@prisma/client";
import status from "http-status";
import { AppError } from "src/app/errors/AppError";

const createFile = async (
  userId: string,
  payload: {
    name: string;
    url: string;
    size: number;
    type: FileType;
    folderId: string;
  },
) => {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Get user + subscription
    const user = await tx.uSER.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    const subscription = user.subscription;

    // 2️⃣ Check total file limit
    if (user.totalFiles >= subscription.totalFiles) {
      throw new AppError(
        status.BAD_REQUEST,
        `File limit exceeded. Max allowed: ${subscription.totalFiles}`,
      );
    }

    // 3️⃣ Check file type
    if (!subscription.allowedFileTypes.includes(payload.type)) {
      throw new AppError(
        status.BAD_REQUEST,
        "This file type is not allowed in your subscription",
      );
    }

    // 4️⃣ Check file size
    if (payload.size > subscription.fileSize) {
      throw new AppError(
        status.BAD_REQUEST,
        `File size exceeds limit. Max allowed: ${subscription.fileSize} MB`,
      );
    }

    // 5️⃣ Validate folder ownership
    const folder = await tx.fOLDER.findFirst({
      where: {
        id: payload.folderId,
        userId,
        isDeleted: false,
      },
    });

    if (!folder) {
      throw new AppError(status.NOT_FOUND, "Folder not found");
    }

    // 6️⃣ Check files per folder limit
    const folderFileCount = await tx.fILE.count({
      where: {
        folderId: payload.folderId,
        isDeleted: false,
      },
    });

    if (folderFileCount >= subscription.filePerFolder) {
      throw new AppError(
        status.BAD_REQUEST,
        `This folder has reached max file limit (${subscription.filePerFolder})`,
      );
    }

    // 7️⃣ Create file
    const file = await tx.fILE.create({
      data: {
        ...payload,
        userId,
      },
    });

    // 8️⃣ Update totalFiles counter
    await tx.uSER.update({
      where: { id: userId },
      data: {
        totalFiles: {
          increment: 1,
        },
      },
    });

    return file;
  });
};

const getFiles = async (folderId: string, userId: string) => {
  const folderExists = await prisma.fOLDER.findFirst({
    where: { id: folderId, userId, isDeleted: false },
  });

  if (!folderExists) {
    throw new AppError(status.NOT_FOUND, "Folder not found");
  }

  return prisma.fILE.findMany({
    where: { folderId, isDeleted: false },
  });
};

const updateFile = async (
  userId: string,
  fileId: string,
  payload: { name?: string },
) => {
  const file = await prisma.fILE.findFirst({
    where: { id: fileId, userId, isDeleted: false },
  });

  if (!file) {
    throw new AppError(status.NOT_FOUND, "File not found");
  }

  return prisma.fILE.update({
    where: { id: fileId },
    data: {
      name: payload.name,
    },
  });
};

const deleteFile = async (userId: string, fileId: string) => {
  return prisma.$transaction(async (tx) => {
    const file = await tx.fILE.findFirst({
      where: { id: fileId, userId, isDeleted: false },
    });

    if (!file) {
      throw new AppError(status.NOT_FOUND, "File not found");
    }

    await tx.fILE.update({
      where: { id: fileId },
      data: { isDeleted: true },
    });

    await tx.uSER.update({
      where: { id: userId },
      data: {
        totalFiles: {
          decrement: 1,
        },
      },
    });

    return null;
  });
};

export const FileService = { createFile, updateFile, deleteFile, getFiles };
