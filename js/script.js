// +++ funzioni +++

// creazione griglia
function createGrid(num) {
    for (row = 1; row <= num; row++) { // ciclo per le righe
        const rowHTML = document.createElement("div"); // creazione div riga
        rowHTML.className = "row row-" + row; // classe dinamica righe
        for (col = 1; col <= num; col++) { // ciclo per le colonne
            const colHTML = document.createElement("div"); // creazione div colonna
            colHTML.className = "col col-" + col; // classe dinamica colonne
            const squareHTML = document.createElement("div"); // creazione div quadrato 
            squareHTML.className = "square hidden " + squareClass(row, col); // classe dinamica quadrati
            squareHTML.innerHTML = `<span class="x">${row}</span><span class="y">${col}</span>`;
            colHTML.append(squareHTML); // inserimento quadrato in colonna
            rowHTML.append(colHTML); // inserimento colonna in riga
        }
        document.getElementById("grid").append(rowHTML); // inserimento riga in griglia
    }
}

// aggiunta bombe
function addBombs(num) {
    // ciclo per numeri random univoci
    let randomArray = [];
    while (randomArray.length < num) { // sviluppo numeri random fino al numero di bombe
        const totalSquares = gridDim * gridDim; // numero di quadrati in totale
        let randomNum = Math.floor(Math.random() * totalSquares); // numero casuale
        if (randomArray.indexOf(randomNum) == -1) { // se il numero casuale non è presente nell'array
            randomArray.push(randomNum) // inserimento numero casuale nell'array
        }
    }
    // ciclo per aggiungere le bombe
    const squares = document.getElementsByClassName("square"); // selezione di tutti i quadrati
    for (let i = 0; i < num; i++) {
        let j = randomArray[i];
        squares[j].classList.add("bomb");
        squares[j].innerHTML += `${bombHTML}`;
        // squares[randomArray[i]].classList.remove("hidden"); // debug****************************
    }
}

// aggiunta click ai quadrati
function addClick (num) {
    for (row = 1; row <= num; row++) {
        for (col = 1; col <= num; col++) {
            square(row, col).addEventListener("click", function() { // richiamo della funzione per selezionare il quadrato e aggiunta del click
                this.classList.remove("hidden");
                bombCheck(this);
            });
        }
    }
}

// controllo quadrati
function bombCheck(div) {
    let a = parseInt(div.querySelector(".x").innerHTML);
    let b = parseInt(div.querySelector(".y").innerHTML);
    if (div.classList.contains("zero")) {
        console.log(div);
        showAround(a, b)

        function showAround(a, b) {
            square(a, b).classList.add("check");
            let r = a - 1;
            for (let i = 0; i < 3; i++) {
                let c = b - 1;
                for (let j = 0; j < 3; j++) {
                    // console.log(a + " " + b);
                    if (square(r, c) != null) {
                    // console.log(a + " " + b);
                        if (square(r, c).innerHTML != `<span class="x">${r}</span><span class="y">${c}</span>${bombHTML}`) {
                            // square(r, c).classList.add("clicked");2

                            square(r, c).classList.remove("hidden");
                            // showAround(r, c);
                            // if (square(r,c).innerHTML != `<span class="x">${r}</span><span class="y">${c}</span>`) {
                            //     showAround(r, c);
                            // }
                            if (square(r, c).classList.contains("zero") && !square(r, c).classList.contains("check")) {
                                let uno = r;
                                let due = c;
                                showAround(uno, due);
                            }
                        }
                    }
                    c++;
                }
                r++
            }
        }
    }
    if (div.innerHTML == `<span class="x">${a}</span><span class="y">${b}</span>${bombHTML}`) {
        div.style.background = "red";
        allBombs = document.getElementsByClassName("bomb");
        for (let i = 0; i < allBombs.length; i++) {
            // allBombs[i].classList.add("clicked");
            allBombs[i].classList.remove("hidden");
        }
    }
}

function popolateGrid() {
    let squareArray = document.getElementsByClassName("square");
    // console.log(squareArray);
    for (let count = 0; count < squareArray.length; count++) {
        let div = squareArray[count];
        let r = parseInt(div.querySelector(".x").innerHTML);
        let c = parseInt(div.querySelector(".y").innerHTML);
        let bombsNum = 0;
        let a = r - 1;
        for (let i = 0; i < 3; i++) {
            let b = c - 1;
            for (let j = 0; j < 3; j++) {
                // console.log(a + " " + b);
                if (square(a, b) != null) {
                // console.log(a + " " + b);
                    if (square(a, b).innerHTML == `<span class="x">${a}</span><span class="y">${b}</span>${bombHTML}`) {
                        bombsNum ++;
                        if (square(r, c).innerHTML != `<span class="x">${r}</span><span class="y">${c}</span>${bombHTML}`) {
                            square(r, c).innerHTML = bombsNum;
                        }
                    }
                }
                b++;
            }
            a++
        }
        if (square(r, c).innerHTML != `<span class="x">${r}</span><span class="y">${c}</span>${bombHTML}`) {
            switch (bombsNum) {
                case 0:
                    square(r, c).style.background = "lightgrey";
                    square(r, c).classList.add("zero");
                    // square(r, c).innerHTML = "";
                    break;
                case 1:
                    square(r, c).style.color = "blue";
                    square(r, c).style.background = "rgb(15,217,119)";
                    break;
                case 2:
                    square(r, c).style.color = "green";
                    square(r, c).style.background = "rgb(15,217,119)";
                    break;
                case 3:
                    square(r, c).style.color = "red";
                    square(r, c).style.background = "rgb(15,217,119)";
                    break;
                case 4:
                    square(r, c).style.color = "violet";
                    square(r, c).style.background = "rgb(15,217,119)";
                    break;
                case 5:
                    square(r, c).style.color = "purple";
                    square(r, c).style.background = "rgb(15,217,119)";
            }
        }
    }
}




// +++ codice +++

// variabli
let gridDim = 0;
let bombs = 0;
let level = parseInt(prompt("Livello: 0, 1 o 2")); // prova inserimento difficoltà
switch (level) { // dimensioni griglia dinamica con difficoltà
    case 0:
        gridDim = 30;
        break;
    case 1:
        gridDim = 20;
        break;
    case 2:
        gridDim = 10;
}
bombs = Math.floor((gridDim * gridDim) / 5);
let row; // contatore delle righe da utilizzare nelle classi dinamiche
let col; // contatore delle colonne da utilizzare nelle classi dinamiche
const squareClass = (a, b) => "square" + a + "_" + b; // funzione per creare una classe dinamica da utilizzare per i quadrati
const square = (a, b) => document.querySelector("." + squareClass(a, b)); // funzione per selezionare un quadrato con classe dinamica
const bombHTML = `<span><i class="fas fa-bomb"></i></span>`;
createGrid(gridDim); // funzione che crea la griglia di gioco
addBombs(bombs); // funzione per aggiungere le bombe
popolateGrid(); // funzione per popolare la griglia
addClick(gridDim); // funzione che aggiunge il click ai quadrati