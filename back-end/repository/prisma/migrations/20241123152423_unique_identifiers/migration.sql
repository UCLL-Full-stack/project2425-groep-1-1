/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[SpeedrunnerId]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[validatorId]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameId]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_gameId_key" ON "Category"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_SpeedrunnerId_key" ON "Speedrun"("SpeedrunnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_validatorId_key" ON "Speedrun"("validatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_gameId_key" ON "Speedrun"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_categoryId_key" ON "Speedrun"("categoryId");
