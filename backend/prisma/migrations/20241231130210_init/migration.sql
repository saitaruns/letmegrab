-- CreateTable
CREATE TABLE "Product" (
    "product_id" SERIAL NOT NULL,
    "SKU" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "material_ids" INTEGER[],
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Material" (
    "material_id" SERIAL NOT NULL,
    "material_name" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("material_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "ProductMedia" (
    "media_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "ProductMaterial" (
    "product_id" INTEGER NOT NULL,
    "material_id" INTEGER NOT NULL,

    CONSTRAINT "ProductMaterial_pkey" PRIMARY KEY ("product_id","material_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_SKU_key" ON "Product"("SKU");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMaterial" ADD CONSTRAINT "ProductMaterial_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "Material"("material_id") ON DELETE RESTRICT ON UPDATE CASCADE;
