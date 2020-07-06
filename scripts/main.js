const Player = (name,symbol) => {
    let wins = 0;
    return {name,symbol,wins};
}

const gameBoard  = (() => {
    //let gameBoardPositions = Array.apply(null,Array(9)).map((x,i) => {return i});
    let gameBoardArray = Array(9).fill("");
    //console.log(gameBoardPositions);
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currPlayer;
    let gameMode = '';
    let gameMoves = 9;
    return {gameBoardArray,player1,player2,currPlayer,gameMode,gameMoves};
})();

const displayController = ((doc) => {
    const subButton1 = doc.getElementById('subBtn1');
    const subButton2 = doc.getElementById('subBtn2');
    const render = function() {
        const cells = doc.querySelectorAll(".cell");
        cells.forEach((cell) => {
            //cell.innerHTML = "X";
            cell.addEventListener('click', (e) => {
                console.log(e);
                if(e.target.innerHTML === "" && gameControls.gameFinish === 0) {
                    e.target.innerHTML = gameBoard.currPlayer.symbol;
                    gameBoard.gameBoardArray[Number(e.target.classList[1])] = gameBoard.currPlayer.symbol;
                    console.log(Number(e.target.classList[1]));
                    gameBoard.gameMoves -= 1;
                    gameControls.checkWin();
                    //if(gameBoard.gameMode === 'PvP') 
                    gameControls.switchTurn();
                    if(gameBoard.gameMode === 'AI') {
                        setTimeout(() => {  gameControls.playAI(); }, 500);
                        gameControls.switchTurn();
                    }
                    if(gameBoard.gameMode === 'AISuper') {
                        setTimeout(() => {  gameControls.playAISuper(); }, 0);
                        gameControls.switchTurn();
                    }
                        
                }
            });
        });
    }
    const startGame = function() {
        if(gameBoard.gameMode === '') {
            window.alert("Please select a mode,then proceed");
        } else {
            const openingPage = doc.querySelector("#openingPage");
            const gamePage = doc.querySelector("#gamePage");
            openingPage.style.display = "none";
            gamePage.style.display = "block";
            doc.forms['player2Form'].reset();
            doc.forms['player1Form'].reset();
            doc.forms['player1Form'].classList.remove('disabled');
            doc.forms['player2Form'].classList.remove('disabled');
            subButton1.disabled = false;
            subButton2.disabled = false;
            gameBoard.currPlayer = gameBoard.player1;
            if(gameBoard.gameMode === 'AI' || gameBoard.gameMode === 'AISuper') {
                if(gameBoard.player1.symbol === 'X')
                    gameBoard.player2 = Player('AI','O');
                else
                    gameBoard.player2 = Player('AI','X'); 
            }
        }
    } 

    const modeSelect = function() {
        const radios = doc.getElementsByName('select');
        console.log(radios);
        radios.forEach((radio) => {
            radio.addEventListener('click', (e) =>{
                gameBoard.gameMode = e.target.value;
                if(gameBoard.gameMode === 'AI' || gameBoard.gameMode === 'AISuper') {
                    doc.forms['player2Form'].classList.add('disabled');
                    subButton2.disabled = true;
                } else {
                    doc.forms['player2Form'].classList.remove('disabled');
                    subButton2.disabled = false; 
                }
            });
        });
    }

    const goBackGame = function() {
        const openingPage = doc.querySelector("#openingPage");
        const gamePage = doc.querySelector("#gamePage");
        openingPage.style.display = "block";
        gamePage.style.display = "none";
        displayController.resetGame();
    } 
    const resetGame = function() {
        const cells = doc.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.innerHTML = "";
        });
        gameControls.gameFinish = 0;
        gameBoard.gameBoardArray = Array(9).fill("");
        const result = doc.getElementById('result');
        result.innerHTML = "";
        gameBoard.gameMoves = 9;
        //gameBoard.currPlayer = gameBoard.player1;
    }
    const subEntry = function() {
        subButton1.addEventListener('click', (e) => {
            console.log(e);
            let name = doc.forms['player1Form']['name'];
            let symbol = doc.forms['player1Form']['symbol'];
            gameBoard.player1 = Player(name.value,symbol.value);
            e.target.disabled = true;
            doc.forms['player1Form'].classList.add('disabled');
        });
        subButton2.addEventListener('click',(e) => {
            console.log(e);
            if(subButton1.disabled === true) {
                let name = doc.forms['player2Form']['name'];
                let symbol = doc.forms['player2Form']['symbol'];
                if(symbol.value === gameBoard.player1.symbol){
                    window.alert("Can't have same symbols");
                    doc.forms['player2Form'].reset();
                    return;
                }
                gameBoard.player2 = Player(name.value,symbol.value);
                e.target.disabled = true;
                doc.forms['player2Form'].classList.add('disabled');
            }
            else {
                window.alert("Please fill details of Player 1 first");
                doc.forms['player2Form'].reset();
            }
        });
    }
    return {render,startGame,resetGame,subEntry,goBackGame,modeSelect};
})(document);

const gameControls = ((doc) => {
    let gameFinish = 0;
    const checkWin = function() {
        const winCombos = [['0','1','2'],['3','4','5'],['6','7','8'],['0','3','6'],['1','4','7'],['2','5','8'],['0','4','8'],['2','4','6']];
        for(let i = 0; i < winCombos.length; i++) {
            if(gameBoard.gameBoardArray[winCombos[i][0]] === gameBoard.currPlayer.symbol && gameBoard.gameBoardArray[winCombos[i][1]] === gameBoard.currPlayer.symbol && gameBoard.gameBoardArray[winCombos[i][2]] === gameBoard.currPlayer.symbol) {
                gameControls.gameFinish = 1;
                const result = doc.getElementById('result');
                result.innerHTML = `${gameBoard.currPlayer.name} wins`;
                return;
            }
        }
        if(gameBoard.gameMoves === 0) {
            const result = doc.getElementById('result');
            result.innerHTML = `Game ends in draw`;
        }
    }
    const switchTurn = function() {
        gameBoard.currPlayer === gameBoard.player1 ? (gameBoard.currPlayer = gameBoard.player2) : (gameBoard.currPlayer = gameBoard.player1);
        console.log('Switched');
    }

    const playAI = function() {
        if(gameControls.gameFinish === 0) {
            gameBoard.gameMoves -= 1;
            gameBoard.currPlayer = gameBoard.player2;
            let cell = Math.floor(Math.random() * Math.floor(9));
            while(gameBoard.gameBoardArray[cell] !== '') {
                cell = Math.floor(Math.random() * Math.floor(9));
            }
            let acCell = "#cell" + cell;
            const selecCell = doc.querySelector(acCell);
            console.log(acCell,selecCell);
            selecCell.innerHTML = gameBoard.currPlayer.symbol;
            gameBoard.gameBoardArray[Number(selecCell.classList[1])] = gameBoard.currPlayer.symbol;
            console.log(Number(selecCell.classList[1]));
            
            gameControls.checkWin();
            gameBoard.currPlayer = gameBoard.player1;
        }
    }

    const playAISuper = function() {
        if(gameControls.gameFinish === 0) {
            let newBoard = [...gameBoard.gameBoardArray];
            gameBoard.gameMoves -= 1;
            gameBoard.currPlayer = gameBoard.player2;
            let cell = AI.minimaxAI(newBoard,gameBoard.player2).index;
            let acCell = "#cell" + cell;
            const selecCell = doc.querySelector(acCell);
            console.log(acCell,selecCell);
            selecCell.innerHTML = gameBoard.currPlayer.symbol;
            gameBoard.gameBoardArray[Number(selecCell.classList[1])] = gameBoard.currPlayer.symbol;
            console.log(Number(selecCell.classList[1]));
            gameControls.checkWin();
            gameBoard.currPlayer = gameBoard.player1;
        }
    }

    return {checkWin, gameFinish, switchTurn , playAI, playAISuper};
})(document);

const AI = (() => {
        
    const minimaxAI = function(board,player) {
        let moves = [];
        let emptySpots = findEmpty(board);
        //console.log(board);
        //console.log(emptySpots);
        if (checkWin(board, gameBoard.player1)) {
            return {score:-10};
        } else if (checkWin(board, gameBoard.player2)) {
           return {score:10};
        } else if (emptySpots.length === 0) {
             return {score:0};
        }
        for(let i = 0; i < emptySpots.length; i++) {
            let currMove = {};
            currMove.index = emptySpots[i];
            board[emptySpots[i]] = player.symbol;

            if(player === gameBoard.player2) {
                let outcome = AI.minimaxAI(board,gameBoard.player1);
                currMove.score = outcome.score;
            } else {
                let outcome = AI.minimaxAI(board,gameBoard.player2);
                currMove.score = outcome.score;
            }
            board[emptySpots[i]] = "";
            moves.push(currMove);
            //if(emptySpots.length === 5 && emptySpots[i] === 1)
                //console.log(currMove,player);
        }
        let bestMove;
        if(player === gameBoard.player2){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        //if(emptySpots.length === 6)
            //console.log(moves[bestMove]);
        console.log(moves);
        return moves[bestMove];
    }
    const findEmpty = function(playBoard) {
        let empty = [];
        for(let i = 0; i < playBoard.length; i++) {
            if(playBoard[i] === '') {
                empty.push(i);
            }
        }
        return empty;
    }
    const checkWin = function(board,player) {
        /*const winCombos = [['0','1','2'],['3','4','5'],['6','7','8'],['0','3','6'],['1','4','7'],['2','5','8'],['0','4','8'],['2','4','6']];
        for(let i = 0; i < winCombos.length; i++) {
            if(gameBoard.gameBoardArray[winCombos[i][0]] === gameBoard.currPlayer.symbol && gameBoard.gameBoardArray[winCombos[i][1]] === gameBoard.currPlayer.symbol && gameBoard.gameBoardArray[winCombos[i][2]] === gameBoard.currPlayer.symbol) {
                return true;
            }
        }
        return false;*/
    
        if (
            (board[0] == player.symbol && board[1] == player.symbol && board[2] == player.symbol) ||
            (board[3] == player.symbol && board[4] == player.symbol && board[5] == player.symbol) ||
            (board[6] == player.symbol && board[7] == player.symbol && board[8] == player.symbol) ||
            (board[0] == player.symbol && board[3] == player.symbol && board[6] == player.symbol) ||
            (board[1] == player.symbol && board[4] == player.symbol && board[7] == player.symbol) ||
            (board[2] == player.symbol && board[5] == player.symbol && board[8] == player.symbol) ||
            (board[0] == player.symbol && board[4] == player.symbol && board[8] == player.symbol) ||
            (board[2] == player.symbol && board[4] == player.symbol && board[6] == player.symbol)
            ) {
            return true;
        } else {
            return false;
        }
    }
    return {minimaxAI};
})();

displayController.render();
displayController.subEntry();
displayController.modeSelect();