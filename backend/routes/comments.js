// backend/routes/comments.js
// -----------------------------------------------------
// Router dédié aux opérations sur les commentaires.
// -----------------------------------------------------

import { Router } from 'express';
import prisma from '../config/db.js';

const router = Router();

// POST /comments → crée un commentaire lié à un article
router.post('/', async (req, res) => {
  try {
    const { text, postId, authorName } = req.body;
    if (!text || !postId) {
      return res.status(400).json({ error: 'Texte et postId requis' });
    }
    const nomAuteur = authorName && authorName.trim() !== '' ? authorName.trim() : 'Anonyme';
    const newComment = await prisma.comment.create({
      data: { text, postId, authorName: nomAuteur },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Erreur POST /comments :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
