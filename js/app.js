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
      gameContainer.appendChild(boardCells[i]);
    }
  }

  return { createBoard };
})('3x3');

gameBoard.createBoard();
