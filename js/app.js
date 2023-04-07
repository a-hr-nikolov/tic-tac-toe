const gameContainer = document.querySelector('.game-container');
const resultsDisplay = document.querySelector('.results');

const displayController = (() => {
  let turnSwitch = true;

  function placeSymbol(event) {
    if (event.target.textContent !== '') return;
    if (turnSwitch) event.target.textContent = 'X';
    else event.target.textContent = 'O';
    turnSwitch = !turnSwitch;
  }

  function checkWinCondition() {
    // I map the empty cells to avoid checking for empty strings
    // throughout the function
    const boardState = gameBoard
      .getBoardState()
      .map(item => item.textContent)
      .map((item, i) => {
        if (item === '') return (item = i);
        else return item;
      });

    // Check rows
    for (let i = 0; i < boardState.length; i += Math.sqrt(boardState.length)) {
      let flagWin = true;
      for (let j = i + 1; j < Math.sqrt(boardState.length) + i; j++) {
        if (boardState[i] !== boardState[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) {
        resultsDisplay.textContent = `${boardState[i]} wins`;
        break;
      }
    }

    // Check columns
    for (let i = 0; i < Math.sqrt(boardState.length); i++) {
      let flagWin = true;
      for (
        let j = i + Math.sqrt(boardState.length);
        j < boardState.length;
        j += Math.sqrt(boardState.length)
      ) {
        if (boardState[i] !== boardState[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) {
        resultsDisplay.textContent = `${boardState[i]} wins`;
        break;
      }
    }

    // Check main diagonal
    (function () {
      let flagWin = true;
      for (
        let i = Math.sqrt(boardState.length) + 1;
        i < boardState.length;
        i += Math.sqrt(boardState.length) + 1
      ) {
        if (boardState[0] !== boardState[i]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) {
        resultsDisplay.textContent = `${boardState[0]} wins`;
      }
    })();

    // Check secondary diagonal
    (function () {
      let flagWin = true;

      // The initial i is initialized like that for math reasons.
      // The condition is grid size - 1 to avoid the last cell of the grid
      // passing the condition.
      for (
        let i = Math.sqrt(boardState.length) * 2 - 2;
        i < boardState.length - 1;
        i += Math.sqrt(boardState.length) - 1
      ) {
        if (boardState[Math.sqrt(boardState.length) - 1] !== boardState[i]) {
          flagWin = false;
          break;
        }
      }

      if (flagWin === true) {
        resultsDisplay.textContent = `${
          boardState[Math.sqrt(boardState.length) - 1]
        } wins`;
      }
    })();
  }

  function onClick(event) {
    placeSymbol(event);
    checkWinCondition();
  }

  return { onClick };
})();

const gameBoard = ((boardSizeString, handleClick) => {
  let boardSize = boardSizeString;
  let boardCells = [];

  function getBoardSize() {
    return +boardSize.match(/^\d/);
  }

  (function createBoard() {
    for (let i = 0; i < getBoardSize() ** 2; i++) {
      boardCells[i] = document.createElement('div');
      boardCells[i].classList.add('cell');
      boardCells[i].addEventListener('click', handleClick);
      gameContainer.appendChild(boardCells[i]);
    }
  })();

  function getBoardState() {
    return [...boardCells];
  }

  return { getBoardState };
})('3x3', displayController.onClick);

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

// Event Listeners need to be turned off if there's a winner.

// Logic to check for a full board and return a tie, if no winner

// include a button to start/restart

// Include grid size adjuster

// Have a Game Controller to handle the Logic, and Display Controller to display without happens
// The GameBoard object should only have an array of elements, it probably shouldn't be used to handle the display
// of said elements.

// Add a DOM Grabbing module

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!
 */
