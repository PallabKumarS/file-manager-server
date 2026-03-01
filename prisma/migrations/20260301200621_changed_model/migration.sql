/*
  Warnings:

  - You are about to drop the column `level` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `nestFolder` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `nestLevel` to the `folders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFolder` to the `folders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nestFolderLevel` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folders" DROP COLUMN "level",
ADD COLUMN     "nestLevel" INTEGER NOT NULL,
ADD COLUMN     "totalFolder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "nestFolder",
ADD COLUMN     "nestFolderLevel" INTEGER NOT NULL;
