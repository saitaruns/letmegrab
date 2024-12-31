const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    '/',
    body('category_name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category_name } = req.body;
        try {
            const category = await prisma.category.create({
                data: { category_name },
            });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    '/:id',
    body('category_name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { category_name } = req.body;
        try {
            const category = await prisma.category.update({
                where: { category_id: parseInt(id) },
                data: { category_name },
            });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({
            where: { category_id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;