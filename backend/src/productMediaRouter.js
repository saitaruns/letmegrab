const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const productMedia = await prisma.productMedia.findMany();
        res.json(productMedia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    '/',
    body('product_id').isInt(),
    body('url').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { product_id, url } = req.body;
        try {
            const media = await prisma.productMedia.create({
                data: { product_id, url },
            });
            res.status(201).json(media);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    '/:id',
    body('product_id').optional().isInt(),
    body('url').optional().isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const updateData = req.body;
        try {
            const media = await prisma.productMedia.update({
                where: { media_id: parseInt(id) },
                data: updateData,
            });
            res.json(media);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.productMedia.delete({
            where: { media_id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;