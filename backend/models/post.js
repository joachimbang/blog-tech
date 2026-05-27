// backend/models/post.js
// -----------------------------------------------------
// Modèle « Post » – fonctions d'accès aux données Prisma.
// -----------------------------------------------------

// backend/models/post.js
// -----------------------------------------------------
// Modèle « Post » – fonctions d'accès aux données Prisma.
// -----------------------------------------------------

import prisma from '../config/db.js';

/**
 * Crée un nouvel article. { title, content, authorId, tagIds }
 */
export async function createPost(data) {
  const { title, content, authorId, tagIds } = data;
  const tagsConnect = tagIds ? tagIds.map(id => ({ id })) : [];
  return prisma.post.create({
    data: { title, content, authorId, tags: { connect: tagsConnect } },
  });
}

/** Retourne tous les articles avec leurs auteurs et tags */
export async function getAllPosts() {
  return prisma.post.findMany({ include: { author: true, tags: true } });
}

/** Retourne un article par son ID */
export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: true, tags: true },
  });
}

/** Met à jour un article */
export async function updatePost(id, data) {
  return prisma.post.update({ where: { id }, data });
}

/** Supprime un article */
export async function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}


/**
 * Crée un nouvel article.
 * @param {Object} data - { title, content, authorId, tagIds }
 */
async function createPost(data) {
  const { title, content, authorId, tagIds } = data;
  const tagsConnect = tagIds ? tagIds.map(id => ({ id })) : [];
  return prisma.post.create({
    data: { title, content, authorId, tags: { connect: tagsConnect } },
  });
}

/** Retourne tous les articles avec leurs auteurs et tags */
async function getAllPosts() {
  return prisma.post.findMany({ include: { author: true, tags: true } });
}

/** Retourne un article par son ID */
async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: true, tags: true },
  });
}

/** Met à jour un article */
async function updatePost(id, data) {
  return prisma.post.update({ where: { id }, data });
}

/** Supprime un article */
async function deletePost(id) {
  return prisma.post.delete({ where: { id } });
}

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };
