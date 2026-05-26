import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg; // import PrismaClient from CommonJS package

const app = express();
app.use(cors());
app.use(express.json());

// Création du client Prisma
const prisma = new PrismaClient();

// Route pour récupérer tous les articles
app.get('/posts', async (req, res) => {
  try {
    const articles = await prisma.post.findMany({ include: { author: true, tags: true } });
    res.json(articles);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// ================== CRUD ROUTES ==================

// Crée un nouvel article (les identifiants sont en UUID)
app.post('/posts', async (req, res) => {
  try {
    const { title, content, authorId, tagIds } = req.body;

    // On prépare la connexion des tags s'il y en a (les IDs sont maintenant des UUID = String)
    const tagsConnect = tagIds ? tagIds.map(id => ({ id })) : [];

    const newPost = await prisma.post.create({
      data: {
          title,
          content,
          authorId,
          tags: {
              connect: tagsConnect
          }
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erreur Prisma (POST):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupère un article par id
app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.post.findUnique({
        where: { id },
        include: { author: true, comments: true, tags: true }
    });
    if (!article) return res.status(404).json({ error: 'Article non trouvé' });
    res.json(article);
  } catch (error) {
    console.error('Erreur Prisma (GET id):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ================== TAG ROUTES ==================
app.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    console.error('Erreur Prisma (GET tags):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/tags', async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await prisma.tag.create({ data: { name } });
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Erreur Prisma (POST tag):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Crée un commentaire pour un article
app.post('/comments', async (req, res) => {
  try {
    const { text, postId, authorName } = req.body;
    if (!text || !postId) return res.status(400).json({ error: 'Texte et postId requis' });

    // Si authorName est vide ou absent, on utilise "Anonyme"
    const nomAuteur = authorName && authorName.trim() !== '' ? authorName.trim() : 'Anonyme';

    const newComment = await prisma.comment.create({
      data: { text, postId, authorName: nomAuteur },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Erreur Prisma (POST comment):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, authorId } = req.body;
    const updated = await prisma.post.update({
      where: { id },
      data: { title, content, authorId },
    });
    res.json(updated);
  } catch (error) {
    console.error('Erreur Prisma (PUT):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Supprime un article
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Erreur Prisma (DELETE):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ================== AUTHOR ROUTES ==================
// Récupérer la liste des auteurs
app.get('/authors', async (req, res) => {
  try {
    const authors = await prisma.author.findMany({ include: { posts: true } });
    res.json(authors);
  } catch (error) {
    console.error('Erreur Prisma (GET authors):', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un nouvel auteur
app.post('/authors', async (req, res) => {
  try {
    const { name, postnom } = req.body;

    // 1. Validation de base : on nettoie et on vérifie que le nom est fourni
    if (!name || name.trim() === '' || !postnom || postnom.trim() === '') {
      return res.status(400).json({ error: 'Le nom et le postnom sont requis' });
    }

    const trimmedName = name.trim();
    const trimmedPostnom = postnom.trim();

    // 2. Recherche explicite de l'existence d'un auteur avec le même nom + postnom
    // On montre clairement comment faire un SELECT (findFirst) pour vérifier l'existence
    const existe = await prisma.author.findFirst({
      where: {
        name: trimmedName,
        postnom: trimmedPostnom
      }
    });

    // Si l'auteur existe déjà, on renvoie une erreur 409
    if (existe) {
      return res.status(409).json({ error: 'Un auteur avec ce nom et postnom existe déjà' });
    }

    // 3. Insertion en base de données
    const newAuthor = await prisma.author.create({
      data: {
        name: trimmedName,
        postnom: trimmedPostnom
      }
    });

    return res.status(201).json(newAuthor);
    console.log('Auteur créé avec succès :', newAuthor);

  } catch (error) {
    console.error('Erreur (POST author):', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
