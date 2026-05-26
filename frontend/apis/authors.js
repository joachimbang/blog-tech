const API_URL = 'http://localhost:3000';

async function loadAuthorsTable() {
    const tbody = document.querySelector('#authorsTable tbody');
    if (!tbody) return;
    try {
        const resp = await fetch(`${API_URL}/authors`);
        const authors = await resp.json();
        tbody.innerHTML = '';
        authors.forEach(author => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${author.name}</td><td>${author.postnom || ''}</td><td>${author.posts ? author.posts.length : 0}</td>`;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Erreur lors du chargement des auteurs', e);
        alert('Impossible de charger les auteurs.');
    }
}

// Fonction utilisée par create_post.html pour remplir la liste déroulante
async function loadAuthorsForSelect() {
    const select = document.getElementById('authorSelect');
    if (!select) return;
    try {
        const response = await fetch(`${API_URL}/authors`);
        const authors = await response.json();
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.id;
            const fullName = author.postnom ? `${author.name} ${author.postnom}` : author.name;
            option.textContent = fullName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des auteurs pour le select :', error);
    }
}

const authorForm = document.getElementById('authorForm');
if (authorForm) {
    authorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('authorName').value.trim();
        const postnom = document.getElementById('authorPostnom').value.trim();
        if (!name) return;
        try {
            const resp = await fetch(`${API_URL}/authors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, postnom })
            });
            if (resp.ok) {
                alert('Auteur créé avec succès');
                document.getElementById('authorName').value = '';
                document.getElementById('authorPostnom').value = '';
                loadAuthorsTable();
            } else {
                const err = await resp.json();
                alert('Erreur : ' + err.error);
            }
        } catch (e) {
            console.error('Erreur serveur', e);
            alert('Impossible de créer l\'auteur');
        }
    });
}

// Si on est sur la page des auteurs, on charge le tableau
if (document.getElementById('authorsTable')) {
    window.addEventListener('load', loadAuthorsTable);
}
