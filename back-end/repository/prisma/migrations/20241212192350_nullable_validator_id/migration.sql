-- DropForeignKey
ALTER TABLE "Speedrun" DROP CONSTRAINT "Speedrun_validatorId_fkey";

-- DropIndex
DROP INDEX "Category_gameId_key";

-- DropIndex
DROP INDEX "Speedrun_categoryId_key";

-- DropIndex
DROP INDEX "Speedrun_gameId_key";

-- DropIndex
DROP INDEX "Speedrun_speedrunnerId_key";

-- DropIndex
DROP INDEX "Speedrun_validatorId_key";

-- AlterTable
ALTER TABLE "Speedrun" ALTER COLUMN "validatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Speedrun" ADD CONSTRAINT "Speedrun_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
