/*
  Warnings:

  - You are about to drop the column `SpeedrunnerId` on the `Speedrun` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[speedrunnerId]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `speedrunnerId` to the `Speedrun` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Speedrun" DROP CONSTRAINT "Speedrun_SpeedrunnerId_fkey";

-- DropIndex
DROP INDEX "Speedrun_SpeedrunnerId_key";

-- AlterTable
ALTER TABLE "Speedrun" DROP COLUMN "SpeedrunnerId",
ADD COLUMN     "speedrunnerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_speedrunnerId_key" ON "Speedrun"("speedrunnerId");

-- AddForeignKey
ALTER TABLE "Speedrun" ADD CONSTRAINT "Speedrun_speedrunnerId_fkey" FOREIGN KEY ("speedrunnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
