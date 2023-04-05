const gameContainer = document.querySelector('.game-container');

const gameBoard = (boardSizeString => {
  let boardSize = boardSizeString;
  let boardCells = [];

  function getBoardSize() {
    return +boardSize.match(/^\d/);
  }

  function createBoard() {
    for (let i = 0; i < getBoardSize() ** 2; i++) {
      boardCells[i] = document.createElement('div');
      boardCells[i].classList.add('cell');
      boardCells[i].addEventListener('click', placeSymbol);
      gameContainer.appendChild(boardCells[i]);
    }
  }

  function placeSymbol(event) {
    event.target.textContent = determineSymbol();
  }

  return { createBoard };
})('3x3');

gameBoard.createBoard();

function createPlayer(name, symbol) {
  const playerName = name;
  const playerSymbol = symbol;

  const getName = () => playerName;
  const getSymbol = () => playerSymbol;

  return { getName, getSymbol };
}
