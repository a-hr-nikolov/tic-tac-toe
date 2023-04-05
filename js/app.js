const gameContainer = document.querySelector('.game-container');
const gameBoard = {
  gridCells: [],
  gridSize: '3x3',
  getGridSize() {
    return +gameBoard.gridSize.match(/^\d/);
  },
};

for (let i = 0; i < gameBoard.getGridSize() ** 2; i++) {
  gameBoard.gridCells[i] = document.createElement('div');
  gameBoard.gridCells[i].classList.add('cell');
  gameContainer.appendChild(gameBoard.gridCells[i]);
}
