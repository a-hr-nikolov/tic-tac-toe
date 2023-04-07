const gameContainer = document.querySelector('.game-container');
const resultsDisplay = document.querySelector('.results');

gameContainer.style.height = getComputedStyle(gameContainer).width;

const gameBoard = (boardSizeString => {
  /* 
  
  After some deliberation on whether to completely separate concerns between a display
  component and a board state component, I decided that I can sacrifice a bit of that
  separation for better performance. It felt right to me.
  
  This is why instead of creating an object that simply holds the contents of the board 
  cells (i.e. the state), it can instead hold the 'cells' themselves - the divs that 
  will be placed in the DOM.
  
  While this doesn't save us the trouble of repopulating the DOM on every change, it
  spares us having to redeclare and reinitialize the divs themselves. This should count
  for something.

  On a similar note, I now understand one aspect of what makes React so powerful. If I
  rewrite this in React, I can actually have separation of concerns AND the performance
  will be the same or better, because of the virtual DOM, as it wouldn't cause unnecessary
  re-renders.
  
  */

  let boardSize = boardSizeString;
  let boardCells = [];

  (function initBoardState() {
    boardCells = [];
    for (let i = 0; i < getBoardSize() ** 2; i++) {
      boardCells[i] = document.createElement('div');
      boardCells[i].classList.add('cell');
      boardCells[i].setAttribute('data-index', `${i}`);
    }
  })();

  function getBoardSize() {
    return +boardSize.match(/^\d/);
  }

  function getBoardState() {
    return boardCells;
  }

  /*

  Here I again had to decide how to treat separation of concerns. I figured
  it is best if I handle the changing of board state from within the gameBoard
  object itself.

  */

  function setBoardCell(index, mark) {
    if (boardCells[index].textContent !== '') return;
    boardCells[index].textContent = mark;
  }

  return { getBoardState, setBoardCell };
})('3x3');

const displayController = (() => {
  let turnSwitch = true;

  (function createBoard() {
    gameContainer.textContent = '';

    let board = gameBoard.getBoardState();
    console.log(board);

    for (let i = 0; i < board.length; i++) {
      board[i].addEventListener('click', onClick);
      gameContainer.appendChild(board[i]);
    }
  })();

  function placeSymbol({ target }) {
    if (target.textContent !== '') return;

    let mark = null;
    if (turnSwitch) mark = 'X';
    else mark = 'O';

    const cellIndex = +target.getAttribute('data-index');
    gameBoard.setBoardCell(cellIndex, mark);

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

    // Check full board with no winner
    if (
      boardState.every(item => /[XO]/.test(item)) &&
      resultsDisplay.textContent === ''
    ) {
      resultsDisplay.textContent = "It's A DRAWWWWWW";
    }
  }

  function onClick(event) {
    placeSymbol(event);
    checkWinCondition();
  }

  return { onClick };
})();

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

// Event Listeners need to be turned off if there's a winner.

// Logic to check for a full board and return a tie, if no winner

// include a button to start/restart

// refactor checkWinCondition to return what should be displayed, but not affecting
// the display. The display should be handled by a different function

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
