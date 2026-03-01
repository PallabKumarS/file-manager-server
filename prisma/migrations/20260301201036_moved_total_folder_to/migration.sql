/*
  Warnings:

  - You are about to drop the column `totalFolder` on the `folders` table. All the data in the column will be lost.
  - Added the required column `totalFolders` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "totalFolder";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "totalFolders" INTEGER NOT NULL;
