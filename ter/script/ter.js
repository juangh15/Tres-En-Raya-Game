class Game {
    constructor() {
        //IDs para la IA
        this.celdaVaciaID = 0;
        this.playerID = -1;
        this.pcID = 1;
        this.SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.WINNING_TRIADS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        // Puntajes
        this.scoreAI = 0;
        this.scorePlayer = 0;

        // IDs para el Jugador
        this.choosedAI = "";
        this.choosedPlayer = "";
        this.result = "";
        this.board = {
            0: "", 1: "", 2: "",
            3: "", 4: "", 5: "",
            6: "", 7: "", 8: ""
        }

        // IDs para CSS
        this.crossDir = {
            0: "",
            1: "horizontal",
            2: "vertical",
            3: "diagonalRising",
            4: "diagonalFalling"
        }
        this.boardSize = Object.keys(this.board).length;
        this.rowSize = Math.sqrt(this.boardSize);
        this.resetInterface();
    }

    // Tacha una celda individual segun direccion (dir)
    crossCell(boardCellID, dir) {
        let cell = document.getElementById("cell" + boardCellID);
        cell.className = "cell " + this.crossDir[dir];
    }

    // Celda presionada
    putCell(boardCellID) {
        // Solo deja poner si no ha ganado o perdido
        if (this.result === "") {
            // Solo deja poner si la celda esta vacia
            if (this.board[boardCellID] === "" && this.choosedPlayer !== "") {
                this.board[boardCellID] = this.choosedPlayer;
                let cellContent = document.getElementById("cell-content-" + boardCellID);
                cellContent.innerText = this.choosedPlayer;
                if(this.choosedPlayer === "X"){cellContent.style="color:blue;"}else{cellContent.style="color:red;"}
                this.check();
                this.update();
                // Sigue la IA despues del jugador
                this.moveAI();
            } else {
                //console.log("ilegal action!");
            }

        } else {
            //console.log("ya hay un ganador en este juego!");
        }

    }
    // Celda presionada por la IA
    autoPutCell(boardCellID) {
        // Solo deja poner si no ha ganado o perdido
        if (this.result === "") {
            // Solo deja poner si la celda esta vacia
            if (this.board[boardCellID] === "" && this.choosedAI !== "") {
                this.board[boardCellID] = this.choosedAI;
                let cellContent = document.getElementById("cell-content-" + boardCellID);
                cellContent.innerText = this.choosedAI;
                if(this.choosedAI === "X"){cellContent.style="color:blue;"}else{cellContent.style="color:red;"}
                this.check();
                this.update();
            } else {
                //console.log("IA ilegal action");
            }

        } else {
            //console.log("ya hay un ganador en este juego!");
        }
    }

    // Reinicia partida
    resetInterface() {
        // Obtiene los td cell
        let gameDiv = document.getElementById("gameboard");
        gameDiv.hidden = false;
        let cells = document.getElementsByClassName("cell");
        for (let cell of cells) {
            cell.className = "cell";
            // Cambia los div cell-content a vacio
            cell.childNodes[1].innerText = "";
        }

        // Obtiene el boton nuevo juego
        document.getElementById("B1").innerText = "Reiniciar puntajes";
        // Reinicia los valores
        this.choosedAI = "";
        this.choosedPlayer = "";
        this.result = "";
        this.board = {
            0: "", 1: "", 2: "",
            3: "", 4: "", 5: "",
            6: "", 7: "", 8: ""
        }
        this.hiddeNewGame(true);
        this.hiddeButtons(false);
        this.hiddeWhoStart(0);
        this.update();
    }

    hiddeWhoStart(isPlayer){
        let empieza = document.getElementById("empieza");
        if (isPlayer===1){
            empieza.innerText="Aleatoriamente empieza: Jugador";
            empieza.hidden=false;
            console.log("empieza jugador");
        } else if(isPlayer===2){
            empieza.innerText="Aleatoriamente empieza: PC";
            empieza.hidden=false;
            console.log("empieza AI");
        } else{
            empieza.innerText="";
            empieza.hidden=true;
        }
        
    }


    update(start=false) {
        let scoreAI = document.getElementById("scoreAI");
        let scorePlayer = document.getElementById("scorePlayer");
        let result = document.getElementById("result");

        if (this.choosedPlayer === "" || this.choosedAI === "") {
            result.innerHTML = "En espera..."
            scorePlayer.innerHTML = "Elige entre X y O presionando uno:"
            scoreAI.innerHTML = "";
        } else if (this.result == "") {
            result.innerHTML = "Presiona una casilla vacia";
            scoreAI.innerHTML = "Puntos PC: " + this.scoreAI;
            scorePlayer.innerHTML = "Puntos jugador: " + this.scorePlayer;
        }
        else {
            document.getElementById("scoreAI").innerHTML = "Puntos PC: " + this.scoreAI;
            document.getElementById("scorePlayer").innerHTML = "Puntos jugador: " + this.scorePlayer;
            document.getElementById("result").innerHTML = "Resultado: " + this.result;

        }

    }

    // Determina la figura elegida por el jugador
    choose(fig) {
        this.hiddeButtons(true);
        this.hiddeNewGame(false);
        if (fig === "X") {
            this.choosedPlayer = "X";
            this.choosedAI = "O";
        } else {
            this.choosedPlayer = "O";
            this.choosedAI = "X";
        }
        this.update();

        // Luego determina aleatoriamente quien empieza
        if (Math.round(Math.random() * 1) === 0) {
            //console.log("comienza ia");
            this.hiddeWhoStart(2);
            this.moveAI();
        } else {
            this.hiddeWhoStart(1);
            //console.log("comienza PLAYER");
        }
    }

    hiddeButtons(choose) {
        document.getElementById("B4").hidden = choose;
        document.getElementById("B5").hidden = choose;
    }

    hiddeNewGame(choose) {
        document.getElementById("B3").hidden = choose;
    }

    round(choosedPlayer) {
        this.hiddeNewGame(true);
        //console.log("a");
        this.resetInterface();
    }

    // Tacha una fila, columna o diagonal partiendo de un indice 
    crossLine(dir, index = 0) {
        if (this.crossDir[dir] === "horizontal") {

            for (let j = 0; j < this.rowSize; j++) {
                this.crossCell(index * this.rowSize + j, dir)
            }

        } else if (this.crossDir[dir] === "vertical") {

            for (let j = 0; j < this.rowSize; j++) {
                this.crossCell(j * this.rowSize + index, dir)
            }

        } else if (this.crossDir[dir] === "diagonalFalling") {

            for (let i = index; i < this.rowSize; i++) {
                this.crossCell((this.rowSize + 1) * i, dir);
            }

        } else if (this.crossDir[dir] === "diagonalRising") {

            for (let i = index; i < this.rowSize; i++) {
                this.crossCell((this.rowSize - 1) * (i + 1), dir);
            }
        }
    }

    // Comprueba si hay ganador (para n celdas)
    check() {
        let boardSize = this.boardSize;
        let rowSize = this.rowSize;
        //console.log(rowSize);
        let suma = 0;
        let actualValue = "";
        let full = 0;

        // Recorrido horizontales
        for (let i = 0; i < rowSize; i++) {
            for (let j = 0; j < rowSize; j++) {
                actualValue = this.board[i * rowSize + j];
                if (actualValue === this.choosedPlayer) {
                    suma += 1;
                    full += 1;
                } else if (actualValue === this.choosedAI) {
                    suma -= 1;
                    full += 1;
                }

            }

            this.checkSuma(suma, 1, i);
            suma = 0;
        }

        // Verifica si todas las celdas estan llenas
        if (full === this.boardSize) {
            this.checkSuma(this.boardSize, 0);
        }

        // Recorrido verticales
        for (let i = 0; i < rowSize; i++) {
            for (let j = 0; j < rowSize; j++) {
                actualValue = this.board[j * rowSize + i];
                if (actualValue === this.choosedPlayer) {
                    suma += 1;
                } else if (actualValue === this.choosedAI) {
                    suma -= 1;
                }
            }
            this.checkSuma(suma, 2, i);
            suma = 0;
        }

        // Recorrido diagonal izq (rowSize+1) * i
        for (let i = 0; i < rowSize; i++) {
            actualValue = this.board[(rowSize + 1) * i];
            if (actualValue === this.choosedPlayer) {
                suma += 1;
            } else if (actualValue === this.choosedAI) {
                suma -= 1;
            }
        }
        this.checkSuma(suma, 4);
        suma = 0;

        // Recorrido diagonal der (rowSize-1)*(i+1)
        for (let i = 0; i < rowSize; i++) {
            actualValue = this.board[(rowSize - 1) * (i + 1)];
            if (actualValue === this.choosedPlayer) {
                suma += 1;
            } else if (actualValue === this.choosedAI) {
                suma -= 1;
            }
        }
        this.checkSuma(suma, 3);
        suma = 0;

    }
    // Hay ganador cuando la suma iguala al tamaño de una fila del tablero 
    // Hay empate cuando el tablero se llena
    checkSuma(suma, dir, index = 0) {
        if (suma === this.rowSize) {
            //console.log("ganaPlayer");
            this.pointPlayer();
            this.crossLine(dir, index);
            this.result = "Ganaste!"
        }
        else if (suma === -this.rowSize) {
            //console.log("ganaAI");
            this.pointAI();
            this.crossLine(dir, index);
            this.result = "Perdiste"
        } else if (suma === this.boardSize) {
            //console.log("empate");
            this.result = "Empate!";
        }
    }

    pointPlayer() {
        this.scorePlayer += 1;
        //this.update();
    }

    pointAI() {
        this.scoreAI += 1;
        //this.update();
    }

    // Determina las acciones de la IA
    moveAI(mind = 0) {
        // console.log("sigue IA");

        // Intentos de IA distintos segun mind:
        // mind 0 = monster
        // mind 1 = dumb
        if (mind === 0) {
            // Transforma a matriz el tablero
            let boardCopy = {};
            for (let i = 0; i < this.boardSize; i++) {
                if (this.board[i] === this.choosedAI) {
                    boardCopy[i] = this.pcID;
                } else if (this.board[i] === this.choosedPlayer) {
                    boardCopy[i] = this.playerID;
                } else {
                    boardCopy[i] = this.celdaVaciaID;
                }
            }
            // Determina movimientos
            let mymv = this.determineMove(boardCopy);
            //console.log("La computadora finalmente decidió jugar", mymv);
            this.autoPutCell(mymv);
            return true;
        } else if (mind === 1) {

            // Movimientos validos por indice
            let validos = [];
            let total = 0;
            for (let i = 0; i < this.boardSize; i++) {
                if (this.board[i] === "") {
                    validos.push(i);
                    total += 1;
                }
            }
            //console.log("validos:" + validos);

            // No hay movimientos validos
            if (total === 0) {
                return false;
            }

            let randIndex = Math.round(Math.random() * (total - 1));
            //console.log("Index de ia: " + validos[randIndex]);
            this.autoPutCell(validos[randIndex]);
        }
    }

    determineMove(board) {
        //Determina el próximo movimiento de la computadora (jugador O), si la valoración es la misma, elija aleatoriamente el número de pasos" ""
        let best_val = -2;  // El resultado de la evaluación de este programa es solo en [-1,0,1]
        let my_moves = [];
        //console.log("Empieza a pensar");
        for (let move in this.SLOTS) {
            if (board[move] === this.celdaVaciaID) {
                board[move] = this.pcID;
                let { ...boardCopy } = board;
                //console.log(boardCopy);
                let val = this.poda_alfa_beta(boardCopy, this.playerID, this.pcID, -2, 2);
                board[move] = this.celdaVaciaID;
                if (val > best_val) {
                    best_val = val;
                    my_moves = [move];
                }
                if (val === best_val) {
                    my_moves.push(move);
                }
            }
        }
        let rand = Math.round(Math.random() * (my_moves.length - 1));

        return my_moves[rand];
    }


    poda_alfa_beta(board, player, next_player, alpha, beta) {
        /*Usando la poda AlphaBeta para calcular la puntuación de la situación actual
                   Debido a que hay pocas capas de búsqueda, la situación final siempre se puede buscar y el resultado de la valoración es [-1,0,1]
        */
        let wnnr = this.winner(board);
        if (wnnr !== this.celdaVaciaID) {
            // Hay ganador
            return wnnr;
        }
        else if (!this.checkEmptyCells(board)) {
            // Sin movimientos validos
            return 0;
        }
        // Compruebe todos los puntos disponibles del jugador actual "jugador"
        for (let move in this.SLOTS) {
            if (board[move] === this.celdaVaciaID) {
                board[move] = player;
                // Intercambia jugadores después de soltar, continúa verificando
                let { ...boardCopy } = board;
                let val = this.poda_alfa_beta(boardCopy, next_player, player, alpha, beta);
                board[move] = this.celdaVaciaID;
                if (player === this.pcID) {  // El jugador actual es O y es el jugador Max (el símbolo es 1)
                    if (val > alpha) {
                        alpha = val;
                    }
                    if (alpha >= beta) {
                        return beta;  // Devuelve directamente el valor máximo posible actual beta, poda
                    }
                } else {  // El jugador actual es X y Min (el símbolo es -1)
                    if (val < beta) {
                        beta = val;
                    }
                    if (beta <= alpha) {
                        return alpha;  // Devuelve directamente el valor alfa más pequeño actual posible, podando
                    }
                }
            }
        }
        let retval;
        if (player === this.pcID) {
            retval = alpha;
        }
        else {
            retval = beta;
        }
        return retval;
    }



    winner(board) {
        //Juzgando al ganador de la posición, el valor de retorno -1 significa que X gana, 1 significa O gana, 0 significa empate o no finalizó" ""
        let triad = [];
        let triad_sum = 0;
        for (let i = 0; i < this.WINNING_TRIADS.length; i++) {
            triad = this.WINNING_TRIADS[i];
            triad_sum = board[triad[0]] + board[triad[1]] + board[triad[2]];
            //console.log(triad[1]);
            if (triad_sum === 3 || triad_sum === -3) {
                return board[triad[0]];  // Indica que el valor de la pieza de ajedrez también es -1: X, 1: O
            }


        }
        return 0;

    }

    checkEmptyCells(board) {
        ///Determine si todavía hay espacio en el tablero" ""
        for (let slot in this.SLOTS) {
            if (board[slot] === this.celdaVaciaID) {
                return true;
            }
        }
        return false;
    }


};
var gameActual;
function restart() {
    gameActual = new Game();
}


