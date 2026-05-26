const API_URL = 'http://localhost:3000';

// ------------------------------------
// LECTURE DES ARTICLES
// ------------------------------------
async function loadAllPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        grid.innerHTML = "";
        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card';
            const authorFullName = post.author ? (post.author.postnom ? `${post.author.name} ${post.author.postnom}` : post.author.name) : 'Inconnu';
            
            let tagsHtml = '';
            if (post.tags && post.tags.length > 0) {
                tagsHtml = '<div class="tags-container">' + post.tags.map(t => `<span class="category-tag">${t.name}</span>`).join('') + '</div>';
            }

            article.innerHTML = `
                <div class="card-content">
                    <h2 class="card-title">${post.title}</h2>
                    ${tagsHtml}
                    <p class="card-excerpt">${post.content.substring(0, 50)}...</p>
                    <div class="card-footer">
                        <span class="author-name">Par ${authorFullName}</span>
                        <a href="article.html?id=${post.id}" class="read-more-btn" style="text-decoration:none; display:inline-block; text-align:center;">Lire la suite</a>
                    </div>
                </div>
            `;
            grid.appendChild(article);
        });
    } catch (error) {
        console.error("Erreur serveur:", error);
        grid.innerHTML = "<p>Impossible de contacter le serveur.</p>";
    }
}

async function loadSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (!postId) return;

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`);
        if (!response.ok) throw new Error('Article non trouvé');
        const post = await response.json();

        const authorFullName = post.author ? (post.author.postnom ? `${post.author.name} ${post.author.postnom}` : post.author.name) : 'Inconnu';

        let tagsHtml = '';
        if (post.tags && post.tags.length > 0) {
            tagsHtml = post.tags.map(t => `<span class="category-tag">${t.name}</span>`).join('');
        }

        document.getElementById('articleTitle').innerHTML = `${post.title} <div style="margin-top:10px;">${tagsHtml}</div>`;
        document.getElementById('articleAuthor').textContent = `Écrit par ${authorFullName}`;
        document.getElementById('articleContent').textContent = post.content;

        // Affichage des commentaires
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            commentsList.innerHTML = '';
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(c => {
                    const li = document.createElement('li');
                    const nom = c.authorName || 'Anonyme';

                    // Formatage de la date en français : ex "25 mai 2026 à 23:15"
                    const date = new Date(c.createdAt);
                    const dateFormatee = date.toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });
                    const heureFormatee = date.toLocaleTimeString('fr-FR', {
                        hour: '2-digit', minute: '2-digit'
                    });

                    li.innerHTML = `
                        <strong>${nom}</strong> : ${c.text}
                        <span class="comment-date">le ${dateFormatee} à ${heureFormatee}</span>
                    `;
                    commentsList.appendChild(li);
                });
            } else {
                commentsList.innerHTML = '<li>Soyez le premier à commenter !</li>';
            }
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
}

// ------------------------------------
// CREATION D'UN ARTICLE
// ------------------------------------
const postForm = document.getElementById('postForm');
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const authorId = document.getElementById('authorSelect').value;
        
        const tagCheckboxes = document.querySelectorAll('input[name="tags"]:checked');
        const tagIds = Array.from(tagCheckboxes).map(cb => cb.value);

        if (!title || !content || !authorId) return;
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, authorId, tagIds })
            });
            if (response.ok) {
                alert('Article créé avec succès !');
                window.location.href = 'index.html';
            } else {
                const err = await response.json();
                alert('Erreur lors de la création : ' + err.error);
            }
        } catch (error) {
            console.error('Erreur serveur :', error);
            alert('Impossible de contacter le serveur.');
        }
    });
}

// ------------------------------------
// GESTION DES COMMENTAIRES
// ------------------------------------
async function postComment() {
    const text = document.getElementById('newCommentText').value;
    if (text.trim() === "") return;

    // On lit le nom tapé par l'utilisateur (peut être vide → serveur mettra "Anonyme")
    const authorNameInput = document.getElementById('commentAuthor');
    const authorName = authorNameInput ? authorNameInput.value.trim() : '';

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (!postId) return;

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, postId, authorName })
        });
        if (response.ok) {
            document.getElementById('newCommentText').value = "";
            if (authorNameInput) authorNameInput.value = "";
            loadSinglePost(); // Recharge la page pour voir le nouveau commentaire
        } else {
            alert("Erreur lors de l'envoi du commentaire.");
        }
    } catch (error) {
        console.error("Erreur serveur:", error);
    }
}

// ------------------------------------
// CHARGEMENT INITIAL (ROUTAGE BASIQUE)
// ------------------------------------
window.onload = () => {
    if (document.getElementById('blogGrid')) loadAllPosts();
    if (document.getElementById('singleArticleSection')) loadSinglePost();
    
    // Si on est sur create_post.html, on charge les auteurs et les tags (fonctions definies dans authors.js et tags.js)
    if (document.getElementById('postForm')) {
        if (typeof loadAuthorsForSelect === 'function') loadAuthorsForSelect();
        if (typeof loadTagsForCheckboxes === 'function') loadTagsForCheckboxes();
    }
};
