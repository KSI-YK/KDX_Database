/*
  Warnings:

  - You are about to drop the column `model` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `total_cnt` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `total_cnt` on the `Tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "limitDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "model",
DROP COLUMN "total_cnt",
ADD COLUMN     "checkedAt" TIMESTAMP(3),
ADD COLUMN     "reportPath" TEXT,
ADD COLUMN     "zipPath" TEXT;

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "model",
DROP COLUMN "total_cnt",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "limitDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
