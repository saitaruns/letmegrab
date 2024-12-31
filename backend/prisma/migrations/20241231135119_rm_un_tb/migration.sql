/*
  Warnings:

  - You are about to drop the `ProductMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductMaterial" DROP CONSTRAINT "ProductMaterial_material_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductMaterial" DROP CONSTRAINT "ProductMaterial_product_id_fkey";

-- DropTable
DROP TABLE "ProductMaterial";

-- CreateTable
CREATE TABLE "_MaterialToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MaterialToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MaterialToProduct_B_index" ON "_MaterialToProduct"("B");

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Material"("material_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToProduct" ADD CONSTRAINT "_MaterialToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
