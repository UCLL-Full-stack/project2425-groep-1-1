/*
  Warnings:

  - You are about to drop the `_CategoryToGame` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToGame" DROP CONSTRAINT "_CategoryToGame_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToGame" DROP CONSTRAINT "_CategoryToGame_B_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "gameId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryToGame";

-- CreateIndex
CREATE UNIQUE INDEX "Category_gameId_key" ON "Category"("gameId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
