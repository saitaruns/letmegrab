const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const generateFakeData = async () => {
    const categories = await prisma.category.createManyAndReturn({
        data: faker.helpers.uniqueArray(faker.commerce.department, 10).map(name => ({ category_name: name })),
    });
    const materials = await prisma.material.createManyAndReturn({
        data: faker.helpers.uniqueArray(faker.commerce.productMaterial, 10).map(name => ({ material_name: name })),
    });
    for (let i = 0; i < 10; i++) {
        const product = await prisma.product.create({
            data: {
                SKU: faker.string.uuid(),
                product_name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()),
                category: {
                    connect: {
                        category_id: categories[
                            faker.number.int({ min: 0, max: categories.length - 1 })
                        ].category_id,
                    },
                },
                materials: {
                    connect: faker.helpers.uniqueArray(materials, faker.number.int({ min: 1, max: 3 })).map(
                        m => ({ material_id: m.material_id }),
                    ),
                }
            },
        });

        await prisma.productMedia.create({
            data: {
                product_id: product.product_id,
                url: faker.image.url(),
            },
        });
    }
    console.log('Data inserted');
    await prisma.$disconnect();
};

generateFakeData().catch(err => {
    console.error(err);
    prisma.$disconnect();
});