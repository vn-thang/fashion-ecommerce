-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FlashSale" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;
