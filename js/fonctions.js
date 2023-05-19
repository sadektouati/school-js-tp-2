/**
 * pour charger les tâches depuis le disque dur du client
 * @returns {Array}
 */
function importerTaches() {
    const tableauSauvegarde = localStorage.getItem("tTacheSauvguarde");
    return tableauSauvegarde ? JSON.parse(localStorage.getItem("tTacheSauvguarde")) : [];
}

/**
 * pour créer des dates formatées selon les consignes
 * @returns {String}
 */
function chaineDate() {
    const tempEncours = new Date();

    /**
     * pour obtenir des chiffres avec le zero à droite
     * @param {Number} valeur 
     * @returns {string}
     */
    function fNombre(valeur) {
        return ("0" + valeur).slice(-2);
    }

    return fNombre(tempEncours.getDate()) + "/" + fNombre(tempEncours.getMonth() + 1) + "/" + tempEncours.getFullYear() + ", " + fNombre(tempEncours.getHours()) + ":" + fNombre(tempEncours.getMinutes()) + ":" + fNombre(tempEncours.getSeconds())
}


/**
 * auto generer un id pour les tâches
 * @returns {Number}
 */
function nextTacheId() {
    if (tTaches.length > 0) return Math.max.apply(Math, tTaches.map(function (o) { return o.id; })) + 1;
    else return 1;
}



/**
 * pour récupérer les noeuds de DOM
 * @param {Element} selecteur 
 * @returns {Element}
 */
export function qs(selecteur) {
    return document.querySelector(selecteur);
}


/**
 * pour sauveguarder le tableau des tâches sur le disque du client
 */
export function sauveguarderTaches() {
    localStorage.setItem("tTacheSauvguarde", JSON.stringify(tTaches));
}


/**
 * pour afficher la liste des tâches en HTML
 */
export function afficherTaches() {

    const listeTaches = qs("#listeTaches");
    listeTaches.innerHTML = "";
    tTaches.forEach(rangee => {
        const tClone = qs("#modeleListe").cloneNode(true)
        for (let prop in rangee) {
            tClone.innerHTML = tClone.innerHTML.replaceAll(`{${prop}}`, rangee[prop]);
        }
        listeTaches.appendChild(tClone.content);
    });
}

/**
 * Insertion d'une tâche dans le tableau des tâches
 */
export function ajouterTache() {
    const vTache = qs("input[name='tache']").value.trim(), vImportance = qs("select[name='importance']").value;
    if (vTache.length == 0) {
        qs('#msgErr').innerHTML = "Au moins un character";
    } else {
        qs('#msgErr').innerHTML = "";
        tTaches.push({ "nom": vTache, "importance": vImportance, "date": chaineDate(), "id": nextTacheId(tTaches), "fait": false });
        qs("input[name='tache']").value = ""
        ordonerTaches(qs("select[name=tri]").value);
        sauveguarderTaches();
        afficherTaches();
        preparerGetionTache();
    }
}

/**
 * préparation des éléments html pour les fonctionalités demandées.
 */
export function preparerGetionTache() {

    document.querySelectorAll(".effacer, .detail, .tache").forEach(function (element) {

        element.addEventListener("click", function () {

            const thisID = element.closest("[data-id]").dataset.id;

            /**
            * fonctionalité de supprission d'une tâche
            */
            if (element.matches(".effacer")) {

                element.closest(".l").remove();
                tTaches = tTaches.filter((tache) => tache.id != thisID);
                sauveguarderTaches(tTaches);

                /**
                * fonctionalité d'affichage de détails d'une tâche
                */
            } else if (element.matches(".detail")) {

                const modale = qs("#modale");
                modale.innerHTML = "";

                const tClone = qs("#modeleDetail").cloneNode(true)
                const rangee = tTaches.filter((tab) => tab.id == thisID)[0];
                for (let prop in rangee) {
                    tClone.innerHTML = tClone.innerHTML.replaceAll(`{${prop}}`, rangee[prop]);
                }
                modale.appendChild(tClone.content);
                modale.show();

                /**
                 * fonctionalité de mise à jour d'une tâche (fait/ non fait)
                 */
            } else if (element.matches(".tache")) {

                tTaches = tTaches.map((rangee) => {
                    if (rangee.id == thisID) {
                        rangee.fait = !rangee.fait; element.setAttribute("data-fait", rangee.fait)
                    } return rangee;
                });
                sauveguarderTaches();

            }

        })
    })
}


/**
 * 
 * @param {Array} tTaches 
 * @param {String} ordre 
 */
export function ordonerTaches(ordre) {
    if (ordre == "nom/importance") {
        tTaches.sort((a, b) => { return (a.nom > b.nom) ? 1 : (a.nom === b.nom) ? ((a.importance > b.importance) ? 1 : -1) : -1 });
    } else {
        tTaches.sort((a, b) => { return (a.importance > b.importance) ? 1 : (a.importance === b.importance) ? ((a.nom > b.nom) ? 1 : -1) : -1 });
    }
}


let tTaches = importerTaches();
export { tTaches };