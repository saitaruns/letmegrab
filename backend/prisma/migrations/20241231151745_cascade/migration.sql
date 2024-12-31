-- DropForeignKey
ALTER TABLE "ProductMedia" DROP CONSTRAINT "ProductMedia_product_id_fkey";

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
