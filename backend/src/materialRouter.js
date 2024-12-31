const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const materials = await prisma.material.findMany();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    '/',
    body('material_name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { material_name } = req.body;
        try {
            const material = await prisma.material.create({
                data: { material_name },
            });
            res.status(201).json(material);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.put(
    '/:id',
    body('material_name').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { material_name } = req.body;
        try {
            const material = await prisma.material.update({
                where: { material_id: parseInt(id) },
                data: { material_name },
            });
            res.json(material);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.material.delete({
            where: { material_id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;