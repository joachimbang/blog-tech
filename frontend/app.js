// On sélectionne les éléments HTML dont on a besoin
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Fonction pour ajouter une tâche à la liste
function addTask() {
    const taskText = taskInput.value.trim(); // On récupère le texte et on enlève les espaces inutiles

    // Si le champ est vide, on s'arrête (return)
    if (taskText === "") {
        alert("Veuillez entrer une tâche !");
        return;
    }

    // Création d'un nouvel élément de liste (<li>)
    const li = document.createElement('li');
    
    // Ajout du texte de la tâche dans le <li>
    li.textContent = taskText;

    // Création du bouton de suppression
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.className = 'delete-btn';
    
    // Quand on clique sur "Supprimer", on retire le <li> de la liste
    deleteBtn.onclick = function() {
        taskList.removeChild(li);
    };

    // On ajoute le bouton au <li>
    li.appendChild(deleteBtn);

    // On ajoute le <li> complet à notre liste <ul>
    taskList.appendChild(li);

    // On vide le champ de texte pour la prochaine tâche
    taskInput.value = "";
}

// Quand on clique sur le bouton "Ajouter", on appelle la fonction addTask
addTaskBtn.addEventListener('click', addTask);

// (Bonus) Permettre d'ajouter en appuyant sur la touche "Entrée"
taskInput.addEventListener('keypress', function(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
        addTask();
    }
});
