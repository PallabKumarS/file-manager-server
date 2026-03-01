/*
  Warnings:

  - You are about to drop the column `fileTotal` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `totalFiles` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "fileTotal",
ADD COLUMN     "totalFiles" INTEGER NOT NULL;
