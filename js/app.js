const gameContainer = document.querySelector('.game-container');

const displayController = (() => {
  let turnSwitch = true;

  function placeSymbol(event) {
    if (turnSwitch) event.target.textContent = 'X';
    else event.target.textContent = 'O';
    turnSwitch = !turnSwitch;
  }

  function checkWinCondition() {
    for (let i = 0; i < Math.sqrt(inputArray.length); i++) {
      if (
        (inputArray[i].textContent === inputArray[i + 1].textContent &&
          inputArray[i].textContent === inputArray[i + 2].textContent) ||
        (inputArray[i].textContent === inputArray[i + 3].textContent &&
          inputArray[i].textContent === inputArray[i + 6].textContent)
      ) {
      }
    }
  }

  function onClick() {}

  return { placeSymbol };
})();

const gameBoard = ((boardSizeString, handleClick) => {
  let boardSize = boardSizeString;
  let boardCells = [];

  createBoard();

  function getBoardSize() {
    return +boardSize.match(/^\d/);
  }

  function createBoard() {
    for (let i = 0; i < getBoardSize() ** 2; i++) {
      boardCells[i] = document.createElement('div');
      boardCells[i].classList.add('cell');
      boardCells[i].addEventListener('click', handleClick);
      gameContainer.appendChild(boardCells[i]);
    }
  }

  function getBoardState() {
    return [...boardCells];
  }

  return { getBoardState };
})('3x3', displayController.placeSymbol);

function createPlayer(name, symbol) {
  const playerName = name;
  const playerSymbol = symbol;

  const getName = () => playerName;
  const getSymbol = () => playerSymbol;

  return { getName, getSymbol };
}

const playerOne = createPlayer('Player One', 'X');
const playerTwo = createPlayer('Player Two', 'O');

// TODO:
// Make it possible to input player name or select symbols

// Place 'handleClick' argument within the gameBoard IIFE
