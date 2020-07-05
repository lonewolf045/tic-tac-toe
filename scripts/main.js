const Player = (name,symbol) => {
    return {name,symbol};
}

const gameBoard  = (() => {
    //let gameBoardPositions = Array.apply(null,Array(9)).map((x,i) => {return i});
    let gameBoardArray = Array(9).fill("");
    //console.log(gameBoardPositions);
    const player1 = Player("Player 1", "x");
    const player2 = Player("Player 2", "o");
    const currPlayer = player1;
    return {gameBoardArray,player1,player2,currPlayer};
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
                    gameControls.checkWin();
                    gameControls.switchTurn();
                }
            });
        });
    }
    const startGame = function() {
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
    return {render,startGame,resetGame,subEntry,goBackGame};
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
            }
        }
    }
    const switchTurn = function() {
        gameBoard.currPlayer == gameBoard.player1 ? (gameBoard.currPlayer = gameBoard.player2) : (gameBoard.currPlayer = gameBoard.player1);
        console.log('Switched');
    }
    return {checkWin, gameFinish, switchTurn};
})(document);

displayController.render();
displayController.subEntry();