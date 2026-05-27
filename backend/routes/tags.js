// backend/routes/tags.js
// -----------------------------------------------------
// Router dédié aux opérations sur les tags.
// -----------------------------------------------------

import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

// GET /tags – récupère la liste de tous les tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    console.error('Erreur GET /tags :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /tags – crée un nouveau tag
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await prisma.tag.create({ data: { name } });
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Erreur POST /tags :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
