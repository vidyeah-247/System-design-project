/*
  Warnings:

  - You are about to drop the column `marketId` on the `Fill` table. All the data in the column will be lost.
  - You are about to drop the column `marketId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Market` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `market` to the `Fill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fill" DROP CONSTRAINT "Fill_marketId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_marketId_fkey";

-- AlterTable
ALTER TABLE "Fill" DROP COLUMN "marketId",
ADD COLUMN     "market" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "marketId",
DROP COLUMN "type",
ADD COLUMN     "market" TEXT NOT NULL,
ALTER COLUMN "price" SET NOT NULL;

-- DropTable
DROP TABLE "Market";

-- DropEnum
DROP TYPE "OrderType";
