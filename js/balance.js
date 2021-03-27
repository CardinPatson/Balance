"use strict"

/*********
UTILITAIRE 
***********/
function setElem(id, v) {
    document.getElementById(id).innerHTML = v;
}
function getElem(id) {

    document.getElementById(id).innerHTML;
}
function addElem(id, v) {

    document.getElementById(id).innerHTML += v;
}
function refElem(id) {

    return document.getElementById(id);
}


/******************
 * VARIABLE GLOBALE 
 ******************/
const unitKg = 1000;
var commande = [];
var total = 0;

var legumes = [
    { lib: 'carotte', prix: 1.05 },
    { lib: 'oignon', prix: 0.55 },
    { lib: 'ail', prix: 1.49 },
    { lib: 'celeri', prix: 1.71 },
    { lib: 'fenouil', prix: 2.11 },
    { lib: 'patate', prix: 1.32 },
    { lib: 'navet', prix: 0.93 },
    { lib: 'potiron', prix: 1.14 },
    { lib: 'courge', prix: 0.98 }
];
var fruits = [
    { lib: 'poire', prix: 4.16 },
    { lib: 'ananas', prix: 2.99 },
    { lib: 'dattes', prix: 6.25 },
    { lib: 'orange', prix: 1.50 },
    { lib: 'pomme', prix: 1.79 },
    { lib: 'banane', prix: 2.31 },
    { lib: 'citron', prix: 3.70 },
    { lib: 'raisin', prix: 2.49 },
    { lib: 'noix', prix: 7.80 },
    { lib: 'prune', prix: 4.52 },
    { lib: 'peche', prix: 3.99 }
];
fruits.sort(function(x, y) {
    return x.lib < y.lib ? -1 : x.lib > y.lib ? 1 : 0;
});
legumes.sort(function(x, y) {
    return x.lib < y.lib ? -1 : x.lib > y.lib ? 1 : 0;
});

/************
 * CALL BACK 
 ************/
document.querySelector("body").addEventListener("load", init(fruits));

document.querySelector("input[name = listeAliment]:first-of-type").addEventListener("click", (event) => {
    init(fruits);
    event.stopPropagation();
});
document.querySelector("input[name = listeAliment]:last-of-type").addEventListener("click", (event) => {
    init(legumes);
    event.stopPropagation();
});


/************************
 * FONCTION DE CHARGEMENT
 ************************/
function init(tab1) {

    var optionNom = "";
    for (let f of tab1) {
        optionNom += "<option>";
        optionNom += f[Object.keys(f)[0]];
        optionNom += "</option>";


    }

    var optionPrix = "";
    for (let p of tab1) {
        optionPrix += "<option>";
        optionPrix += p[Object.keys(p)[1]];
        optionPrix += "</option>";


    }

    var sizes = "";
    sizes += tab1.length;
    setElem("prixAliment", optionPrix);
    /**
     * Ajouter dynamiquement l'attribut size= aux deux <select> afin de
     *bien voir toutes les lignes ...  
     */

    setElem("nomAliment", optionNom);
    refElem("nomAliment").setAttribute('size', sizes);
    refElem("prixAliment").setAttribute('size', sizes);

    //Il faut éviter que la première ligne soit sélectionnée par défaut;
    //-1 permet de déselectionner ce qui est selectionner par defaut

    refElem("nomAliment").selectedIndex = -1;
    refElem("prixAliment").selectedIndex = -1;

    /**
     * on affiche dans le pied de table le contenu de la variable total
     */

    setElem("Total", parseFloat(total));

}





//FONCTION DE SYNCHRONISATION DES LIBELLES
//UTILISATION DU SELECTINDEX PERMET DE DONNER A CHAQUE OPTION UN INDEX A PARTIR DE 0

//1 CAS DUNE SELECTION DALIMENT
function synchroAliment() {

    var indexNomAliment = refElem("nomAliment").selectedIndex;

    // MISE DE LOPTION PRIX AU MEME NIVEAU QUE LOPTION ALIMENT
    refElem('prixAliment').selectedIndex = indexNomAliment;


}

//2 CAS DUNE SELECTION DE PRIX
function synchroPrix() {

    var indexPrix = refElem('prixAliment').selectedIndex;

    // MISE DE LOPTION FRUIT AU MEME NIVEAU QUE LOPTION PRIX
    refElem("nomAliment").selectedIndex = indexPrix;
}


//CABLAGE DUNE FONCTION AJOUTERALIMENT(...) SUR LEVENEMENT ONCLICK DU FORMULAIRE 
//DOIT ETRE REFAIT AVEC LEVENEMENT ONSUBMIT : REVISER CETTE PARTIE  



function ajouterAliment(tab) {
    //document.form1.poidsAliment.classList.add("required");

    //RECUPERATION DU NUMERO DE LIGNE SELECTIONNE DE LA LISTE DOPTION
    var indexNomAliment = refElem("nomAliment").selectedIndex;

    //RECUPERATION DE LA VALEUR DE LA QUANTITE EN GRAMME ENTREE
    var quantiteEntre = document.form1.poidsAliment.value;
    if (quantiteEntre < 50 || quantiteEntre > 10000) {
        return document.form1.poidsAliment.setAttribute("placeholder", "Entre 50G et 10KG!!!");

    }

    //CREATION DE LOBJET LISTE QUI SERA PUSHER DANS LA COMMANDE 
    //PROPRIETE : (Fruit , Prix , quantite )
    var liste = {};

    // AJOUT DES VALEURS AUX PROPRIETES DE LOBJET LISTE
    liste.Fruit = tab[indexNomAliment].lib;
    liste.Prix = +(tab[indexNomAliment]["prix"]);
    liste.quantite = +((+quantiteEntre) / unitKg);


    //SYNCHRONISATION DE 2 LISTE AYANT LE MEME FRUIT
    // LES QUANTITES DOIVENT ETRE REVUS AINSI QUE LE TOTAL
    // SI LE FRUIT NEST PAS DANS LA COMMANDE : ENREGISTRER ; SINON : IL FAUT MODIFIER EN CONSEQUENCE LA LIGNE DE COMMANDE 


    //
    if (commande.length === 0) {
        commande.push(liste);
    } else {
        //POUR CHAQUE LISTE QUI FAIT DEJA PARTI DU TABLEAU COMMANDE
        for (let com of commande) {

            //1ere CONDITION :  VERIFIE SI LE FRUIT (Liste.Fruit) NE FAIS PAS PARTI DU TABLEAU DES VALEURS (Object.values(com)) ET SI ON EST BIEN A LA DERNIERE POSITION DU TABLEAU
            if ((Object.values(com).indexOf(liste.Fruit) === -1) && (commande.indexOf(com) === (commande.length - 1))) {

                //AJOUT DE LOBJET LISTE A LA VARIABLE GLOBALE COMMADE 
                commande.push(liste);
                break;
            }
            //2eme CONDITION SI LE FRUIT (Liste.Fruit)  EST DANS LE TABLEAU DE VALEUR (Object.values(com))
            else if (Object.values(com).indexOf(liste['Fruit']) !== -1) {

                //AJOUT DE LA QUANTITE SELECTIONNER DANS LA QUANTITE
                com["quantite"] = +((com["quantite"] + liste.quantite).toFixed(2));
                break;

            }
        }
    }
    //REINITIALISATION DE LA VARIABLE GLOBLALE TOTAL
    total = 0;

    //CALCUL DE LA VALEUR FINALE DE LA VARIABLE GLOBALE TOTAL
    for (let com of commande) {
        total += com['quantite'] * com['Prix'];
    }
    total = +total.toFixed(2)
    afficherAliment();

}

document.querySelector("section.sectionSecondaire2 button:first-of-type").addEventListener("click", (event) => {

    //ATTENTION JE DOIS TROUVER UNE AUTRE CONDITION CAR ON PEUT AVOIR POUR 02 TABLEAUX LA MEME LONGUEUR
    if (document.querySelectorAll("select#nomAliment option").length === fruits.length) {
        ajouterAliment(fruits);
        //document.querySelectorAll("select.sectionSecondaire2 button:first-of-type").addEvendListener('click', ajouterAliment(fruits));
    } else if (document.querySelectorAll("select#nomAliment option ").length === legumes.length) {
        //document.querySelectorAll("select.sectionSecondaire2 button:first-of-type").addEvendListener('click', ajouterAliment(legumes));
        ajouterAliment(legumes);
    }
    event.stopPropagation();

})



function afficherAliment() {


    var ajout = "";


    //  TRI DU TABLEAU COMMANDE
    commande.sort(function(x, y) {
        return x.Fruit < y.Fruit ? -1 : x.Fruit > y.Fruit ? 1 : 0;
    });



    //VIDE DE LA BALISE ID TABFRUIT
    setElem('tabFruit', ajout);

    //MODIFICATION DE LA VARIABLE LOCALE AJOUT 
    for (let com of commande) {

        ajout += "<tr>";
        for (let j of Object.keys(com)) {

            // AJOUT DES CELLULES <TD> A LA VARIABLE AJOUT
            j === "Fruit" ? ajout += " <td class ='tabarticle'> " + com[j] + " </td> " : ajout += " <td> " + com[j] + " </td> ";
        }
        ajout += " <td class ='tabtotaux'> " + Number((com['Prix'] * com['quantite']).toFixed(2)) + " </td></tr>";
    }

    //AFFECTATION DE LA CHAINE AJOUT A LA BALISE ID TABFRUIT
    setElem('tabFruit', ajout);

    // AJOUT DE LA VALEUR DE LA VARIABLE TOTAL A LA BALISE ID TOTAL 
    setElem('Total', total);


    return false;
}

//LUTILISATEUR DOIT POUVOIR ENLEVER DEFINITIVEMENT UN ARICLE DE SON PANIER SANS LE REPESER(l'attribut required sur pesez sera a revoir)
function enleverAliment() {
    //document.getElementById("poids").removeAttribute("required");

    //RECUPERATION DU NUMERO DE LIGNE SELECTIONNE DE LA LISTE DOPTION
    var indexNomAliment = refElem("nomAliment").selectedIndex;

    //recuperation du nom du fruit dans le formulaire
    var alimentSupprimer = document.querySelectorAll("select#nomAliment option")[indexNomAliment].innerText;


    //1ere condition sera de verifier si l'aliment selectionner est bien dans la commade
    if (commande.length !== 0) {
        for (let i in commande) {
            /* if (Object.values(commande[i]).indexOf(alimentSupprimer) === -1 && commande.indexOf === (commande.length - 1)) {
                 break;
             } else*/
            if (Object.values(commande[i]).indexOf(alimentSupprimer) !== -1) {
                commande = commande.filter(function(x) { return x !== commande[i] });
                //REINITIALISATION DE LA VARIABLE GLOBLALE TOTAL
                total = 0;

                //CALCUL DE LA VALEUR FINALE DE LA VARIABLE GLOBALE TOTAL
                for (let com of commande) {
                    total += com['quantite'] * com['Prix'];
                }
                total = +total.toFixed(2);
                afficherAliment();
                //return false;
                //break;

            }
        }
    }
}

function imprimerAliment() {

    refElem("barcode").innerHTML = DrawHTMLBarcode_Code39("" + total + "", "yes", "in", 0, 3, 1, 0.50, "bottom", "center", "", " white", "black");
    window.print();
    document.getElementById("date").appendChild("" + new Date() + "");
    //event.preventDefault();
    return false;

}