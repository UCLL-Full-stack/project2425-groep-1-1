/*
  Warnings:

  - A unique constraint covering the columns `[videoLink]` on the table `Speedrun` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Speedrun_videoLink_key" ON "Speedrun"("videoLink");
