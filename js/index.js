// le formulaire de recherche
const form = document.querySelector(".formulaire");
const searchInput = document.querySelector(".searchInput");
const select = document.querySelector(".form-select");
const btnValid = document.querySelector(".btnValid");

// zone du resultat de la recherche
const resultZone = document.querySelector(".resultZone");

/////////////// MESSAGE /////////////

// message loading
const loading = document.querySelector(".loading");

// message nombre de resultat de la recheche
const nrbResult = document.querySelector(".nbrResult");

// message info resultat sans recherche
const msgInfo = document.querySelector(".msgInfo");

// bouton pour afficher plus de resultat
const btnMore = document.querySelector(".btnMore");

// mgsAlert Input
const msgAlert = document.querySelector(".alertResult");



/////////////// MODAL /////////////

// modal
const modal = document.querySelector("#modal");
// modal header
const modalHeaderh3 = document.querySelector(".modal-title");
const btnXModal = document.querySelector(".btn-close");
// modal content
const zoneCover = document.querySelector(".zoneCover");
const pTitle = document.querySelector(".titleM");
const pArtist = document.querySelector(".artist");
const pAlbum = document.querySelector(".album");
const pGenre = document.querySelector(".genre");
const pLength = document.querySelector(".length");
const pNote = document.querySelector(".note");
// msg erreur
const modalerreur = document.querySelector(".modalerreur");
// message loading modal
const loadingModal = document.querySelector(".loadingModal");
// modal footer
const btnFooter = document.querySelector(".btnFooter");

////////////////////////////////////////////

btnXModal.addEventListener("click", () =>{
    modal.classList.remove("notHidden");
    zoneCover.textContent = " ";
    modalerreur.hidden = true; // alertmodal disparait
    modalerreur.textContent = " ";
    modalHeaderh3.textContent = "";
    pArtist.textContent = "";
    pTitle.textContent = "";
    pAlbum.textContent = "";
    pNote.textContent = "";
    pLength.textContent = "";
    pGenre.textContent = "";
})

btnFooter.addEventListener("click", () =>{
    modal.classList.remove("notHidden");
    zoneCover.textContent = " ";
    modalerreur.hidden = true; // alertmodal disparait
    modalerreur.textContent = " ";
    modalHeaderh3.textContent = "";
    pArtist.textContent = "";
    pTitle.textContent = "";
    pAlbum.textContent = "";
    pNote.textContent = "";
    pLength.textContent = "";
    pGenre.textContent = "";
    pNote.textContent = "";
})
 

function showTabl(nombre, artiste, titre, alb, length, genre, idCover, idArtist){

    let ligne = document.createElement("tr");

    let numLigne = document.createElement("th");
    numLigne.setAttribute("scope", "row");
    numLigne.textContent = parseInt(nombre);

    let artistLigne = document.createElement("td");
    artistLigne.textContent = artiste;

    let titleLigne = document.createElement("td");
    titleLigne.textContent = titre;

    let albumLigne = document.createElement("td");
    albumLigne.textContent = alb;

    let btnLigne = document.createElement("td");
    let btnL = document.createElement("button");
    btnL.setAttribute("type", "button");
    btnL.className = "btn btn-outline-dark fs-3";

    let spanBtnL = document.createElement("span");
    spanBtnL.className = "bi bi-person-lines-fill";

    ligne.appendChild(numLigne);
    ligne.appendChild(artistLigne);
    ligne.appendChild(titleLigne);
    ligne.appendChild(albumLigne);

    ligne.appendChild(btnLigne);
    btnLigne.appendChild(btnL);
    btnL.appendChild(spanBtnL);

    resultZone.append(ligne);

    // click sur button action affiche la modal
    btnL.addEventListener("click", function(){
        modal.classList.add("notHidden");
        getCover(artiste, titre, alb, length, genre, idCover, idArtist);
        loadingModal.hidden = false; // affiche le loading
    })

}

form.addEventListener("submit", function(ev){ 
    ev.preventDefault();
    newShow();

    // recupere la valeur de barre de recherche
    resultInput = searchInput.value;

    if(!searchInput.value){
        loading.hidden = true; // loading disparait
        msgAlert.hidden = false; // msgAlert s'affiche
        msgAlert.textContent = "Please enter a value";
    }

    switch(select.value){
        case "Everything":
            getEverything(newResult, resultInput)
            ev.target.reset(); // input search reset
                console.log("function Everything");
            break;
        case "Artist":
            getArtist(newResult, resultInput)
            ev.target.reset(); // input search reset
                console.log("function Artist");
            break;
        case "Title":
            getTitle(newResult, resultInput)
            ev.target.reset(); // input search reset
                console.log("function Title");
            break;
        case "Album":
            getAlbum(newResult, resultInput)
            ev.target.reset(); // input search reset
                console.log("function Album");
            break;
    }

})

