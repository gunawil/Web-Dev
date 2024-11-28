const gameState = {
    arrayBoard : Array(9).fill(null),
    arrayHistory : [],
    isX : true,
    winner: false,
}

function initializeBoards(){
    const board = document.querySelector('.board')
    for (let i = 0; i < 9; i++){
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-index', i);
    
        board.appendChild(square);
    }
}

initializeBoards();

const boards = document.querySelector('.board');
boards.addEventListener('click', handleSquareClick);

function handleSquareClick(e){
    if (!e.target.classList.contains('square')) return;

    if (gameState.winner) {
        alert(`Game has ended\nThe Winner is ${gameState.winner}`);
        return;
    }
    
    const squareIndex = e.target.getAttribute('data-index');

    if (gameState.arrayBoard[squareIndex] === null){
        let turn = gameState.isX ? 'X': 'O';
        let nextTurn = gameState.isX ? 'O': 'X';
    
        gameState.arrayBoard[squareIndex] = turn;    
        gameState.arrayHistory.push([...gameState.arrayBoard]);
        gameState.isX = !gameState.isX;
    
        let nullValue = gameState.arrayBoard.includes(null);
        gameState.winner = setWinner(gameState.arrayBoard);

        e.target.innerHTML = turn;
        updateGameStatus(nextTurn, nullValue, gameState.winner);
        updateUIHistory();
    }
}

function handleBackButton(backIndex){
    goback(backIndex);
}

function updateGameStatus(status = 'X', nullValue = true, winner = false){
    const ox = document.querySelector('.ox');
    let labelStatus = ``;
    if (gameState.winner) {
        labelStatus = `Winner: ${gameState.winner}`;
    }else{
        labelStatus = nullValue ? `Turn: ${status}` : `Game is Draw!`
    }

    ox.innerHTML = labelStatus;
}

const buttonReset = document.querySelector('.button-reset');
buttonReset.addEventListener('click', function(){
    gameState.arrayBoard.every(element => element === null) ? alert `The board is empty\nReady to start new game!` : resetGame();
})

function resetBoard(){
    gameState.arrayBoard.fill(null);
    gameState.winner = false;

    const contentSquare = document.querySelectorAll('.square');
    contentSquare.forEach(square => square.innerHTML='');
}

function resetHistory(){
    gameState.arrayHistory = [];
    
    const histDetailLi = document.querySelector('.history-detail ul');
    while (histDetailLi.firstChild){
        histDetailLi.removeChild(histDetailLi.firstChild);
    }
}

function resetGame(){
    if (!gameState.arrayBoard.every(element => element === null)){
        resetBoard();
        resetHistory();
        updateGameStatus('X', true);
        gameState.isX = true;
    }
}

function createHistoryButton(index){
    const backButton = document.createElement('button');
    backButton.setAttribute('data-index', index);
    backButton.classList.add('button-back');
    backButton.textContent = `this step`;
    backButton.addEventListener('click', () => handleBackButton(index));

    return backButton;
}

function addHistoryStep(){
    const historyDetail = document.querySelector('.history-detail ul');

    const newLi = document.createElement('li');
    newLi.textContent = `Go back to `;
    newLi.append(createHistoryButton(gameState.arrayHistory.length - 1));

    historyDetail.appendChild(newLi);
}

function updateUIHistory(){
    const historyDetail = document.querySelector('.history-detail ul');

    while (historyDetail.children.length > gameState.arrayHistory.length){
        historyDetail.removeChild(historyDetail.lastChild);
    }

    addHistoryStep();
}

function updateBoardFromHistory(backIndex){
    gameState.arrayBoard = [...gameState.arrayHistory[backIndex]];
    
    const squares = document.querySelectorAll('.square');
    squares.forEach(i => i.innerHTML = gameState.arrayBoard[i.dataset.index]);

}

function removeFutureHistory(backIndex){
    gameState.arrayHistory.splice(backIndex + 1);
    
    const histLi = document.querySelectorAll('.history-detail ul li');
    for (let i = backIndex + 1; i < histLi.length; i++){
        histLi[i].remove();
    }
}

function goback(backIndex){
    updateBoardFromHistory(backIndex);
    removeFutureHistory(backIndex);

    gameState.winner = false;
    backIndex % 2 === 0 ? gameState.isX = false : gameState.isX = true;
    updateGameStatus(gameState.isX ? 'X' : 'O');
}


function setWinner(arrayBoard){
    const lines = [
        [0, 1, 2],
        [3, 4, 5], 
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i =0; i < lines.length; i++){
        const [a, b, c] = lines[i];

        if (arrayBoard[a] && arrayBoard[a] === arrayBoard[b] && arrayBoard[a] === arrayBoard[c]){
            return arrayBoard[a];
        }
    }

    return false;
}

