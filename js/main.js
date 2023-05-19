import {
    tTaches, ajouterTache, ordonerTaches, preparerGetionTache, afficherTaches, sauveguarderTaches, qs
} from "./fonctions.js";

/**
 * Tous se passe aprés l'Evenement "load" de la page
 */
window.onload = function () {



    /**
     * charger le tableau depui localStorage et afficher
     */
    if (tTaches.length) {
        ordonerTaches("nom/importance");
        afficherTaches();
    }

    /**
     * préparation pour l'application
     */
    preparerGetionTache(tTaches);

    const formAjouterTache = qs("form[name='frm1']");
    /**
     * ajout de listener sur submit de la form, pour ajouter une tache au tableau des taches et afficher le nouveau tableau
     */
    formAjouterTache.addEventListener("submit", function (evSubmit) {
        evSubmit.preventDefault();
        ajouterTache();
    })


    const boutonOrdre = qs("select[name=tri]");
    /**
     * tri et affichage des taches
     */
    boutonOrdre.addEventListener("change", function () {
        let ordre = boutonOrdre.value
        ordonerTaches(ordre);
        sauveguarderTaches();
        afficherTaches();
        preparerGetionTache();
    })

}

