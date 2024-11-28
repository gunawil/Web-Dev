let arrayBoard = Array(9).fill(null);
let arrayHistory = [];

// Create 9 squares
const board = document.querySelector('.board')
for (let i = 0; i < 9; i++){
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('data-index', i);

    board.appendChild(square);
}

let isX = true
board.addEventListener('click', function(e){
    if (e.target.classList.contains('square')){
        if (setWinner(arrayBoard)) {
            alert(`Game has ended\nThe Winner is ${setWinner(arrayBoard)}`);
            return;
        }

        const squareIndex = e.target.getAttribute('data-index');
    
        if (arrayBoard[squareIndex] === null){
            let turn = '';
            if (isX){
                e.target.innerHTML = 'X';
                arrayBoard[squareIndex] = 'X';
                turn = 'O';
            }else{
                e.target.innerHTML = 'O';
                arrayBoard[squareIndex] = 'O';
                turn = 'X';
            }
    
            arrayHistory.push([...arrayBoard]);
    
            isX = !isX;
    
            const winner = setWinner(arrayBoard);
            let status = 'Turn: X';
            if (winner){
                status = `Winner: ${winner}`;
            }else if (arrayBoard.includes(null) === false){
                status = `Game is draw!`;
            }else{
                status = `Turn: ${turn}`;
            }
    
            const ox = document.querySelector('.ox');
            ox.innerHTML = status;
            updateUIHistory();
        }
    }
})

const buttonReset = document.querySelector('.button-reset');
buttonReset.addEventListener('click', function(){
    resetGame();
})

function resetGame(){
    arrayBoard.fill(null);
    arrayHistory = [];

    const contentSquare = document.querySelectorAll('.square');
    contentSquare.forEach(square => square.innerHTML='');

    const histDetailLi = document.querySelector('.history-detail ul');
    while (histDetailLi.firstChild){
        histDetailLi.removeChild(histDetailLi.firstChild);
    }

    ox = document.querySelector('.ox');
    ox.innerHTML = `Turn: X`;
}

function updateUIHistory(){
    const historyDetail = document.querySelector('.history-detail ul');

    while (historyDetail.children.length > arrayHistory.length){
        historyDetail.removeChild(historyDetail.lastChild);
    }

    const newLi = document.createElement('li');
    newLi.textContent = `Go back to `;

    const backButton = document.createElement('button');
    backButton.setAttribute('data-index', arrayHistory.length-1);
    backButton.classList.add('button-back');
    backButton.textContent = `this step`;

    backButton.addEventListener('click', function(){
        const backIndex = parseInt(this.getAttribute('data-index'));
        goback(backIndex);
    });

    newLi.appendChild(backButton);
    historyDetail.appendChild(newLi);

}

function goback(backIndex){
    arrayBoard = [...arrayHistory[backIndex]];

    squares = document.querySelectorAll('.square');
    squares.forEach(i => i.innerHTML = arrayBoard[i.dataset.index]);

    eraseIndex = Number(backIndex) + 1;
    arrayHistory.splice(eraseIndex);

    const histLi = document.querySelectorAll('.history-detail ul li');
    for (let i = eraseIndex; i < histLi.length; i++){
        histLi[i].remove();
    }
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

