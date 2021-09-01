
let newResult = 0; // represente l'offset
let resultInput; // represente la valeur de barre de recherche

// fonction pour reflesh
function newShow(){
    resultZone.textContent = " ";
}

// function boucle de chaque requetes
function resultRequest(displaySearch){
    for(i in displaySearch.recordings){

        nombre ++;
        titre = displaySearch.recordings[i].title;
        idArtist = displaySearch.recordings[i].id;

        let artiste = [];
        for(h in displaySearch.recordings[i]["artist-credit"]){
            artiste.push(displaySearch.recordings[i]["artist-credit"][h].name)
        }

        if(displaySearch.recordings[i].length === undefined){
            length = "Length - Not results";
        }else{
            length = displaySearch.recordings[i].length;
        }

        let genre = [];
        if(displaySearch.recordings[i].tags === undefined){
            genre = "Not results genre";
        }else{
            for(k in displaySearch.recordings[i].tags){
                genre.push(displaySearch.recordings[i].tags[k].name)
            }
        }

        // si release est undefined, alb = inconnu
        let idCover = [];
        let alb = [];
        if(displaySearch.recordings[i]["releases"] === undefined){
            alb = 'INCONNU';
        }else{
            for(j in displaySearch.recordings[i]["releases"]){
                idCover.push(displaySearch.recordings[i]["releases"][j].id);
                alb.push(displaySearch.recordings[i]["releases"][j].title);
            }
        }

        showTabl(nombre, artiste, titre, alb, length, genre, idCover, idArtist);

        // si count est > 100 le bouton moreResult s'affiche
        if(displaySearch.count > 100){
            btnMore.hidden = false;
        }else{
            btnMore.hidden = true;
        }
    }

    // si count est = 0 le bouton erreur
    if(displaySearch.count === 0){
        msgAlert.hidden = false; // msgAlert s'affiche
        msgAlert.textContent = "No results has been found";
        btnMore.hidden = true;
    }

    nrbResult.hidden = false; // nmbre de resultat s'affiche
    nrbResult.textContent = "Results : " + (parseInt(displaySearch.count)-1);

}

// fonction cover pour les images
function getCover(artiste, titre, alb, length, genre, idCover, idArtist){
    for(u in idCover){
        const requestSearch = new XMLHttpRequest();
        requestSearch.open('GET', 'https://coverartarchive.org/release/' + idCover[u], true);

        requestSearch.addEventListener("readystatechange", function(){

            if(requestSearch.readyState === XMLHttpRequest.DONE){
                if(requestSearch.status === 200){
                    loadingModal.hidden = true; // loading disparait

                    const displayCover = JSON.parse(requestSearch.responseText);

                    for(i in displayCover.images){
                        let imgCover = document.createElement("img");
                        imgCover.className = "rounded mx-auto d-block";
                        imgCover.src = displayCover.images[i].thumbnails.small;
                        zoneCover.appendChild(imgCover);

                        modalHeaderh3.textContent = "Album of - " + artiste;
                        pArtist.textContent = "Artist - " + artiste;
                        pTitle.textContent = "Title - " + titre;
                        pAlbum.textContent = "Album - " + alb;

                        if(length === "Length - Not results"){
                            pLength.textContent = "Length - Not results";
                        }else{
                            pLength.textContent = "Length - " + Math.floor(length / 60000) + ":" + Math.floor((length % 60000) / 1000) + " min";
                        }

                        pGenre.textContent = "Genres - " + genre;
                    }

                    // fonction pour les ratings
                    getRating(idArtist);

                }
                else{
                    modalerreur.hidden = false; // alertmodal apparait
                    modalerreur.textContent = "No results images";
                    loadingModal.hidden = true; // loading disparait
                    modalHeaderh3.textContent = "Album of - " + artiste;
                    pArtist.textContent = "Artist - " + artiste;
                    pTitle.textContent = "Title - " + titre;
                    pAlbum.textContent = "Album - " + alb;
                    if(length === "Length - Not results"){
                        pLength.textContent = "Length - Not results";
                    }else{
                        pLength.textContent = "Length - " + Math.floor(length / 60000) + ":" + Math.floor((length % 60000) / 1000) + " min";
                    }
                    pGenre.textContent = "Genres - " + genre;

                    // fonction pour les ratings
                    getRating(idArtist);
                }
            }

        })

        requestSearch.send();
        // requestRating.send();
    }
}

// REQUETE POUR LES RATINGS 
function getRating(idArtist){
    const requestRating = new XMLHttpRequest();
    requestRating.open('GET', 'https://musicbrainz.org/ws/2/recording/' + idArtist + '?inc=ratings&fmt=json', true);

    requestRating.addEventListener("readystatechange", function(){
        if(requestRating.readyState === XMLHttpRequest.DONE){
            if(requestRating.status === 200){
                const displayRating = JSON.parse(requestRating.responseText);

                if(displayRating.rating.value === null){
                    pNote.textContent = "Note - Not result note";
                }else{
                    let note = displayRating.rating.value;
                    pNote.textContent = "Note - " + note;
                }
            }
        }
    })

    requestRating.send();
}

function getEverything(newResult, resultInput){
    const requestSearch = new XMLHttpRequest();
    requestSearch.open('GET', 'https://musicbrainz.org/ws/2/recording/?inc=genres&fmt=json&limit=100&offset='+ newResult + '&query=' + '"' + encodeURIComponent(resultInput) + '"', true);

    requestSearch.addEventListener("readystatechange", function(){

        loading.hidden = false; // affiche le loading

        if(requestSearch.readyState === XMLHttpRequest.DONE){
            if(requestSearch.status === 200){
                msgInfo.hidden = true; // message info disparait
                loading.hidden = true; // loading disparait
                msgAlert.hidden = true; // msgAlert disparait
    
                const displaySearch = JSON.parse(requestSearch.responseText);

                // nombre prend la valeur de l'offset
                nombre = newResult;

                resultRequest(displaySearch);

                // bouton pour afficher les resultats sup
                btnMore.addEventListener("click", function(){
                    newResult += 100;
                    getEverything(newResult, resultInput);
                })

            }
            else{
                console.log(requestSearch.status)
                loading.hidden = true; // loading disparait
                btnMore.hidden = true;
                nrbResult.hidden = true;
            }
        }

    })

    requestSearch.send();
}


function getTitle(newResult, resultInput){
    const requestSearch = new XMLHttpRequest();
    requestSearch.open('GET', 'https://musicbrainz.org/ws/2/recording/?inc=genres&fmt=json&limit=100&offset='+newResult+ '&query=recording:' + '"' + encodeURIComponent(resultInput) + '"', true);

    requestSearch.addEventListener("readystatechange", function(){

        loading.hidden = false; // affiche le loading

        if(requestSearch.readyState === XMLHttpRequest.DONE){
            if(requestSearch.status === 200){
                msgInfo.hidden = true; // message info disparait
                loading.hidden = true; // loading disparait
                msgAlert.hidden = true; // msgAlert disparait
    
                const displaySearch = JSON.parse(requestSearch.responseText);

                // nombre prend la valeur de l'offset
                nombre = newResult;

                resultRequest(displaySearch);

                // bouton pour afficher les resultats sup
                btnMore.addEventListener("click", function(){
                    newResult += 100;
                    getTitle(newResult, resultInput);
                })

            }
            else{
                console.log(requestSearch.status)
                loading.hidden = true; // loading disparait
                btnMore.hidden = true;
                nrbResult.hidden = true;
            }
        }

    })

    requestSearch.send();
}


function getArtist(newResult, resultInput){

    const requestSearch = new XMLHttpRequest();
    requestSearch.open('GET', 'https://musicbrainz.org/ws/2/recording/?inc=genres&fmt=json&limit=100&offset='+newResult+'&query=artist:' + '"' + encodeURIComponent(resultInput) + '"', true);

    requestSearch.addEventListener("readystatechange", function(){

        loading.hidden = false; // affiche le loading

        if(requestSearch.readyState === XMLHttpRequest.DONE){
            if(requestSearch.status === 200){
                msgInfo.hidden = true; // message info disparait
                loading.hidden = true; // loading disparait
                msgAlert.hidden = true; // msgAlert disparait
    
                const displaySearch = JSON.parse(requestSearch.responseText);

                // nombre prend la valeur de l'offset
                nombre = newResult;

                resultRequest(displaySearch);

                // bouton pour afficher les resultats sup
                btnMore.addEventListener("click", function(){
                    newResult += 100;
                    getArtist(newResult, resultInput);
                })
                
            }
            else{
                console.log(requestSearch.status)
                loading.hidden = true; // loading disparait
                btnMore.hidden = true;
                nrbResult.hidden = true;
            }
        }

    })

    requestSearch.send();
}

function getAlbum(newResult, resultInput){
    const requestSearch = new XMLHttpRequest();
    requestSearch.open('GET', 'https://musicbrainz.org/ws/2/recording/?inc=genres&fmt=json&limit=100&primary-type:album&offset=' + newResult + '&query=release:' + '"' + encodeURIComponent(resultInput) + '"', true);

    requestSearch.addEventListener("readystatechange", function(){

        loading.hidden = false; // affiche le loading

        if(requestSearch.readyState === XMLHttpRequest.DONE){
            if(requestSearch.status === 200){
                msgInfo.hidden = true; // message info disparait
                loading.hidden = true; // loading disparait
                msgAlert.hidden = true; // msgAlert disparait
    
                const displaySearch = JSON.parse(requestSearch.responseText);

                // nombre prend la valeur de l'offset
                nombre = newResult;

                resultRequest(displaySearch);

                // bouton pour afficher les resultats sup
                btnMore.addEventListener("click", function(){
                    newResult += 100;
                    getAlbum(newResult, resultInput);
                })
            }
            else{
                console.log(requestSearch.status)
                loading.hidden = true; // loading disparait
                btnMore.hidden = true;
                nrbResult.hidden = true;
            }
        }

    })

    requestSearch.send();
}


