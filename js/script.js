// +++ funzioni +++

// creazione griglia
function createGrid() {
    for (row = 1; row <= gridRows; row++) { // ciclo per le righe
        const rowHTML = document.createElement("div"); // creazione div riga
        rowHTML.className = "row row-" + row; // classe dinamica righe
        for (col = 1; col <= gridCols; col++) { // ciclo per le colonne
            const colHTML = document.createElement("div"); // creazione div colonna
            colHTML.className = "col col-" + col; // classe dinamica colonne
            const squareHTML = document.createElement("div"); // creazione div quadrato 
            squareHTML.className = "square hidden " + squareClass(row, col); // classe dinamica quadrati
            // squareHTML.innerHTML = `<span class="x">${row}</span><span class="y">${col}</span>`;
            colHTML.append(squareHTML); // inserimento quadrato in colonna
            rowHTML.append(colHTML); // inserimento colonna in riga
        }
        document.getElementById("grid").append(rowHTML); // inserimento riga in griglia
    }
}

// aggiunta bombe
function addBombs() {
    // ciclo per numeri random univoci
    let randomArray = [];
    while (randomArray.length < bombs) { // sviluppo numeri random fino al numero di bombe
        const totalSquares = gridRows * gridCols; // numero di quadrati in totale
        let randomNum = Math.floor(Math.random() * totalSquares); // numero casuale
        if (randomArray.indexOf(randomNum) == -1) { // se il numero casuale non è presente nell'array
            randomArray.push(randomNum) // inserimento numero casuale nell'array
        }
    }
    // ciclo per aggiungere le bombe
    const squares = document.getElementsByClassName("square"); // selezione di tutti i quadrati
    for (let i = 0; i < bombs; i++) {
        let j = randomArray[i];
        squares[j].classList.add("bomb");
        squares[j].innerHTML += '<div class="inner-square"><i class="fas fa-bomb"></i></div>';
    }
}

// aggiunta click ai quadrati
function addClick () {
    let clickFunction = function() {
        if (!(this.classList.contains("flagged"))) {
            this.classList.remove("hidden");
            this.classList.add("checked");
            squareCheck(this);
        }
    }
    let flagFunction = function() {
        if (!(this.classList.contains("flagged")) && flags > 0) {
            this.classList.add("flagged");
            const stringClass = this.classList[2];
            let a = parseInt(stringClass[6] + stringClass[7]);
            let b = parseInt(stringClass[9] + stringClass[10]);
            const flagHTML = document.createElement("div");
            flagHTML.classList.add("flag", "flag" + a + "_" + b);
            flagHTML.innerHTML = '<img src="/img/red-flag-16.png" alt="flag icon">';
            this.append(flagHTML);
            flags--;
        } else {
            this.classList.remove("flagged");
            this.querySelector(".flag").remove();
            flags++;
        }
        document.querySelector(".flags-num").innerHTML = flags;
    }
    let flagBool = false;
    doClick();
    const flagBtn = document.getElementById("flag");
    flagBtn.addEventListener("click", function() {
        if (flagBool == false) {
            doNotClick();
            flagBool = true;
            flagBtn.classList.add("clicked");
            document.getElementById("grid").classList.add("flag-cursor");
            for (row = 1; row <= gridRows; row++) {
                for (col = 1; col <= gridCols; col++) {
                    if (!(square(row, col).classList.contains("checked"))) {
                        square(row, col).addEventListener("click", flagFunction);
                    }
                }
            }
        } else {
            flagBool = false;
            flagBtn.classList.remove("clicked");
            document.getElementById("grid").classList.remove("flag-cursor");
            for (row = 1; row <= gridRows; row++) {
                for (col = 1; col <= gridCols; col++) {
                    square(row, col).removeEventListener("click", flagFunction);
                }
            }
            doClick();
        }
    });
    function doNotClick() {
        for (row = 1; row <= gridRows; row++) {
            for (col = 1; col <= gridCols; col++) {
                square(row, col).removeEventListener("click", clickFunction);
            }
        }
    }
    function doClick() {
        for (row = 1; row <= gridRows; row++) {
            for (col = 1; col <= gridCols; col++) {
                square(row, col).addEventListener("click", clickFunction);
            }
        }
    }
}

// controllo quadrati
function squareCheck(thisSquare) {
    const stringClass = thisSquare.classList[1];
    console.log(stringClass);
    let a = parseInt(stringClass[6] + stringClass[7]);
    let b = parseInt(stringClass[9] + stringClass[10]);
    if (square(a, b).classList.contains("zero")) {
        showAround(a, b);
    }
    if (thisSquare.classList.contains("bomb")) {
        thisSquare.querySelector(".inner-square").style.background = "red";
        thisSquare.querySelector(".inner-square").style.color = "black";
        allBombs = document.getElementsByClassName("bomb");
        for (let i = 0; i < allBombs.length; i++) {
            allBombs[i].classList.remove("hidden");
            if (allBombs[i].classList.contains("flagged")) {
                allBombs[i].querySelector(".flag").remove();
            }
        }
        document.querySelector(".overlay").classList.add("active");
    }
}

// funzione ricorsiva che rivela tutti i quadrati vuoti intorno
function showAround(a, b) {
    square(a, b).classList.add("check");
    let r = a - 1;
    for (let i = 0; i < 3; i++) {
        let c = b - 1;
        for (let j = 0; j < 3; j++) {
            if (square(r, c) != null) {
                if (!(square(r, c).classList.contains("bomb")) && !(square(r, c).classList.contains("flagged"))) {
                    square(r, c).classList.remove("hidden");
                    square(r, c).classList.add("checked");
                    if (square(r, c).classList.contains("zero") && !square(r, c).classList.contains("check")) {
                        showAround(r, c);
                    }
                }
            }
            c++;
        }
        r++
    }
}

// funzione per scrivere i numeri nella griglia
function popolateGrid() {
    let squareArray = document.getElementsByClassName("square");
    for (let count = 0; count < squareArray.length; count++) {
        let div = squareArray[count];
        const stringClass = div.classList[2];
        let r = parseInt(stringClass[6] + stringClass[7]);
        let c = parseInt(stringClass[9] + stringClass[10]);
        let bombsNum = 0;
        let a = r - 1;
        for (let i = 0; i < 3; i++) {
            let b = c - 1;
            for (let j = 0; j < 3; j++) {
                if (square(a, b) != null) {
                    if (square(a, b).classList.contains("bomb")) {
                        bombsNum ++;
                        if (!(square(r, c).classList.contains("bomb"))) {
                            square(r, c).innerHTML = `<div class="inner-square">${bombsNum}</div>`;
                        }
                    }
                }
                b++;
            }
            a++
        }
        if (!(square(r, c).classList.contains("bomb"))) {
            switch (bombsNum) {
                case 0:
                    square(r, c).innerHTML = '<div class="inner-square null"></div>';
                    square(r, c).classList.add("zero");
                    break;
                case 1:
                    square(r, c).style.color = "blue";
                    break;
                case 2:
                    square(r, c).style.color = "green";
                    break;
                case 3:
                    square(r, c).style.color = "red";
                    break;
                case 4:
                    square(r, c).style.color = "violet";
                    break;
                case 5:
                    square(r, c).style.color = "purple";
            }
            if (bombsNum != 0) {
                square(r, c).querySelector(".inner-square").classList.add("green", "number");
            }
        }
    }
}




// +++ codice +++

// variabli
let bombs, row, col, gridRows, gridCols, flags;
const squareClass = (a, b) => { // funzione per creare una classe dinamica da utilizzare per i quadrati
    a = ("0" + a).slice(-2);
    b = ("0" + b).slice(-2);
    return "square" + a + "_" + b;
}
const square = (a, b) => document.querySelector("." + squareClass(a, b)); // funzione per selezionare un quadrato con classe dinamica
let smallGrid = document.getElementById("small");
smallGrid.addEventListener("click", function() {
    document.getElementById("grid").innerHTML = "";
    gridRows = 10;
    gridCols = 10;
    bombs = Math.floor((gridRows * gridCols) / 5);
    createGame();
})
let mediumGrid = document.getElementById("medium");
mediumGrid.addEventListener("click", function() {
    document.getElementById("grid").innerHTML = "";
    gridRows = 20;
    gridCols = 20;
    bombs = Math.floor((gridRows * gridCols) / 5);
    createGame();
})
let largeGrid = document.getElementById("large");
largeGrid.addEventListener("click", function() {
    document.getElementById("grid").innerHTML = "";
    gridRows = 30;
    gridCols = 30;
    bombs = Math.floor((gridRows * gridCols) / 5);
    createGame();
})
let customGrid = document.getElementById("custom");
customGrid.addEventListener("click", function() {
    document.getElementById("grid").innerHTML = "";
    gridRows = document.getElementById("rows").value;
    gridCols = document.getElementById("cols").value;
    bombs = document.getElementById("bombs").value;
    createGame();
})
function createGame() {
    flags = bombs;
    document.querySelector(".bombs-num").innerHTML = bombs;
    document.querySelector(".flags-num").innerHTML = flags;
    const sidebar = document.querySelector(".right");
    document.getElementById("flag").classList.remove("clicked");
    sidebar.classList.add("active");
    document.querySelector(".overlay").classList.remove("active");
    document.querySelector(".grid-container").classList.add("active");
    createGrid(); // funzione che crea la griglia di gioco
    addBombs(); // funzione per aggiungere le bombe
    popolateGrid(); // funzione per popolare la griglia
    addClick(); // funzione che aggiunge il click ai quadrati
}