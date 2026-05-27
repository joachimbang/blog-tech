// backend/routes/posts.js
// -----------------------------------------------------
// Router dédié aux opérations sur les articles (posts).
// -----------------------------------------------------

import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../models/post.js';

const router = Router();

// GET /          → Tous les posts
router.get('/', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error('Erreur GET posts :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /         → Création d'un post
router.post('/', async (req, res) => {
  try {
    const newPost = await createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erreur POST post :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /:id       → Un post par son ID
router.get('/:id', async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });
    res.json(post);
  } catch (error) {
    console.error('Erreur GET post/:id :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /:id       → Mise à jour d'un post
router.put('/:id', async (req, res) => {
  try {
    const updated = await updatePost(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Erreur PUT post/:id :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /:id    → Suppression d'un post
router.delete('/:id', async (req, res) => {
  try {
    await deletePost(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur DELETE post/:id :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
