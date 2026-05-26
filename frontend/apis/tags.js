const API_URL = 'http://localhost:3000';

async function loadTagsTable() {
    const tagsList = document.getElementById('tagsList');
    if (!tagsList) return;
    try {
        const response = await fetch(`${API_URL}/tags`);
        const tags = await response.json();
        tagsList.innerHTML = '';
        
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.textContent = tag.name;
            tagsList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des tags", error);
    }
}

// Fonction utilisée par create_post.html pour générer les checkboxes
async function loadTagsForCheckboxes() {
    const container = document.getElementById('tagsContainer');
    if (!container) return;
    try {
        const response = await fetch(`${API_URL}/tags`);
        const tags = await response.json();
        tags.forEach(tag => {
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.gap = '5px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = tag.id;
            checkbox.name = 'tags';
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(tag.name));
            container.appendChild(label);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des tags pour checkboxes :', error);
    }
}

const tagForm = document.getElementById('tagForm');
if (tagForm) {
    tagForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('tagName').value;
        
        try {
            const response = await fetch(`${API_URL}/tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            
            if (response.ok) {
                document.getElementById('tagName').value = '';
                loadTagsTable();
            } else {
                alert("Erreur lors de la création du tag");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    });
}

if (document.getElementById('tagsList')) {
    window.addEventListener('load', loadTagsTable);
}
