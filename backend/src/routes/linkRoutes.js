const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Lista todos os links (Público) com paginação e busca
router.get('/', async (req, res) => {
  const { page = 1, limit = 30, search } = req.query;
  const p = parseInt(page);
  const l = parseInt(limit);
  const skip = (p - 1) * l;

  try {
    const where = {};
    if (search) {
        where.name = { contains: search, mode: 'insensitive' };
    }

    const [links, total] = await prisma.$transaction([
        prisma.link.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: l
        }),
        prisma.link.count({ where })
    ]);

    res.json({
        links,
        total,
        pages: Math.ceil(total / l),
        currentPage: p
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar links' });
  }
});

// Cria novo link (Admin/Editor)
router.post('/', authenticate, async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'Nome e URL são obrigatórios' });
  }

  try {
    const link = await prisma.link.create({
      data: { name, url },
    });
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar link' });
  }
});

// Deleta link (Admin/Editor)
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.link.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Link removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover link' });
  }
});

module.exports = router;
