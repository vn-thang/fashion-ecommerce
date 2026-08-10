-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "flashSaleVariantId" UUID;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_flashSaleVariantId_fkey" FOREIGN KEY ("flashSaleVariantId") REFERENCES "FlashSaleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
