const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = Router();
const prisma = new PrismaClient();
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, SKU, product_name, category_id, material_ids } = req.query;
    const filters = {};

    if (SKU) filters.SKU = { contains: SKU, mode: 'insensitive' };
    if (product_name) filters.product_name = { contains: product_name, mode: 'insensitive' };
    if (category_id) filters.category_id = parseInt(category_id);
    if (material_ids) filters.material_ids = { hasSome: material_ids.map(id => parseInt(id)) };

    try {
        const products = await prisma.product.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: parseInt(limit),
        });
        res.json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post(
    '/',
    body('SKU').isString().notEmpty(),
    body('product_name').isString().notEmpty(),
    body('category_id').isInt(),
    body('material_ids').isArray(),
    body('price').isFloat(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { SKU, product_name, category_id, material_ids, price } = req.body;
        try {
            const product = await prisma.product.create({
                data: { SKU, product_name, category_id, material_ids, price },
            });
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { product_id: parseInt(id) },
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
);

router.put(
    '/:id',
    body('SKU').optional().isString().notEmpty(),
    body('product_name').optional().isString().notEmpty(),
    body('category_id').optional().isInt(),
    body('material_ids').optional().isArray(),
    body('price').optional().isFloat(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const updateData = req.body;
        try {
            const product = await prisma.product.update({
                where: { product_id: parseInt(id) },
                data: updateData,
            });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { product_id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/highest-price/category', async (req, res) => {
    try {
        const highestPriceProducts = await prisma.product.groupBy({
            by: ['category_id'],
            _max: {
                price: true,
            },
        });

        res.json(highestPriceProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/price-range-count', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            select: {
                price: true,
            },
        });

        const priceRanges = {
            '0-500': 0,
            '501-1000': 0,
            '1000+': 0,
        };

        products.forEach(product => {
            if (product.price <= 500) {
                priceRanges['0-500']++;
            } else if (product.price <= 1000) {
                priceRanges['501-1000']++;
            } else {
                priceRanges['1000+']++;
            }
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/no-media', async (req, res) => {
    try {
        const productsWithoutMedia = await prisma.product.findMany({
            where: {
                media: {
                    none: {},
                },
            },
        });
        res.json(productsWithoutMedia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;