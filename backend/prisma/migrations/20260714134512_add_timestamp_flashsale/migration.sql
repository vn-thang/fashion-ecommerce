/*
  Warnings:

  - Added the required column `updatedAt` to the `FlashSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FlashSaleVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FlashSale" ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE "FlashSaleVariant" ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL;
