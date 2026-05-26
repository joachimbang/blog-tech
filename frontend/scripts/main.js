// ==========================================
// LOGIQUE FRONTEND (INTERACTIONS)
// ==========================================

/**
 * Fonction algorithmique simple pour afficher/masquer la zone de commentaires.
 * Elle est appelée quand on clique sur le bouton "Voir Commentaires"
 *
 * @param {HTMLElement} btnElement - Le bouton sur lequel on a cliqué
 */
function toggleComments(btnElement) {
    // 1. Algorithme de navigation dans le DOM (L'arbre HTML)
    // On part du bouton (btnElement), on remonte à son parent (card-content),
    // puis au parent de celui-ci (blog-card).
    const cardElement = btnElement.parentElement.parentElement.parentElement;

    // 2. On cherche la div "comments-section" A L'INTERIEUR de cette carte précise
    const commentsDiv = cardElement.querySelector('.comments-section');

    // 3. Condition (If / Else) : Logique de bascule (Toggle)
    if (commentsDiv.style.display === "none") {
        commentsDiv.style.display = "block"; // On l'affiche
        btnElement.textContent = "Cacher Commentaires"; // On change le texte du bouton
    } else {
        commentsDiv.style.display = "none";  // On la cache
        btnElement.textContent = "Voir Commentaires";
    }
}