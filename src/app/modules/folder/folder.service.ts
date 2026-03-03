import prisma from "@/lib/prisma";
import { AppError } from "../../errors/AppError";
import { status } from "http-status";
import type { FOLDER } from "src/generated/client";

const createFolder = async (
  userId: string,
  payload: { name: string; parentId?: string },
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

    // 2️⃣ Check total folder limit using counter
    if (user.totalFolders >= user.subscription.maxFolder) {
      throw new AppError(
        status.BAD_REQUEST,
        `Folder limit exceeded. Max allowed: ${user.subscription.maxFolder}`,
      );
    }

    let nestLevel = 1;

    // 3️⃣ Validate parent folder
    if (payload.parentId) {
      const parent = await tx.fOLDER.findFirst({
        where: {
          id: payload.parentId,
          userId,
          isDeleted: false,
        },
      });

      if (!parent) {
        throw new AppError(status.NOT_FOUND, "Parent folder not found");
      }

      nestLevel = parent.nestLevel + 1;

      if (nestLevel > user.subscription.nestFolderLevel) {
        throw new AppError(
          status.BAD_REQUEST,
          `Nesting limit exceeded. Max allowed: ${user.subscription.nestFolderLevel}`,
        );
      }
    }

    // 4️⃣ Create folder
    const folder = await tx.fOLDER.create({
      data: {
        name: payload.name,
        parentId: payload.parentId,
        userId,
        nestLevel,
      },
    });

    // 5️⃣ Update counter
    await tx.uSER.update({
      where: { id: userId },
      data: {
        totalFolders: {
          increment: 1,
        },
      },
    });

    return folder;
  });
};

const getFolders = async (userId: string) => {
  return prisma.fOLDER.findMany({
    where: { userId, isDeleted: false },
  });
};

const updateFolder = async (id: string, payload: Partial<FOLDER>) => {
  return prisma.fOLDER.update({
    where: { id },
    data: payload,
  });
};

const deleteFolder = async (userId: string, folderId: string) => {
  return prisma.$transaction(async (tx) => {
    const folder = await tx.fOLDER.findFirst({
      where: { id: folderId, userId, isDeleted: false },
    });

    if (!folder) {
      throw new AppError(status.NOT_FOUND, "Folder not found");
    }

    await tx.fOLDER.update({
      where: { id: folderId },
      data: { isDeleted: true },
    });

    await tx.uSER.update({
      where: { id: userId },
      data: {
        totalFolders: {
          decrement: 1,
        },
      },
    });

    return null;
  });
};

export const FolderService = {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
};
