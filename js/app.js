import { DOMobj } from './DOM.js';
import { initGameBoard } from './gameBoard.js';

function createPlayer(name, marker) {
  return { name, marker };
}

const gameBoard = initGameBoard('3x3');

const playerOne = createPlayer('Player 1', 'x');
const playerTwo = createPlayer('Player 2', 'o');

const displayController = ((
  {
    gameContainer,
    resultsDisplay,
    restartBtn,
    playerMarkers,
    switchBtn,
    postgameDisplay,
  },
  gameBoard,
  playerOne,
  playerTwo
) => {
  // For switching turns on every click
  let turnSwitch = true;

  // For switching who starts first each round
  let startSwitch = true;

  const board = [];

  for (let i = 0; i < gameBoard.getGridSize(); i++) {
    board[i] = document.createElement('div');
    board[i].setAttribute('data-index', `${i}`);
    board[i].addEventListener('click', handleCellClick);
    gameContainer.appendChild(board[i]);
  }

  switchBtn.addEventListener('click', switchMarkers);
  restartBtn.addEventListener('click', resetBoard);

  const setUpBoard = (function setUpBoard() {
    board.forEach((item, i) => {
      item.className = 'cell';
      item.setAttribute('data-marked', 'unmarked');
      gameBoard.setBoardCell(i, 'unmarked');
    });

    return setUpBoard;
  })();

  function placeMarker({ target }) {
    let marker = null;
    if (turnSwitch) marker = playerOne.marker;
    else marker = playerTwo.marker;

    const cellIndex = +target.getAttribute('data-index');

    // Updates display
    board[cellIndex].classList.add(marker);
    board[cellIndex].setAttribute('data-marked', marker);

    // Updates state, possibly should be abstracted in another function
    gameBoard.setBoardCell(cellIndex, marker);
  }

  function checkWinCondition() {
    const boardState = gameBoard.getBoardState();
    const trackSize = Math.sqrt(boardState.length);

    // Check rows
    for (let i = 0; i < boardState.length; i += trackSize) {
      let flagWin = true;
      if (boardState[i] === 'unmarked') continue;
      for (let j = i + 1; j < trackSize + i; j++) {
        if (boardState[i] !== boardState[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) return boardState[i];
    }

    // Check columns
    for (let i = 0; i < trackSize; i++) {
      let flagWin = true;
      if (boardState[i] === 'unmarked') continue;
      for (let j = i + trackSize; j < boardState.length; j += trackSize) {
        if (boardState[i] !== boardState[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) return boardState[i];
    }

    // Check main diagonal
    if (boardState[0] !== 'unmarked') {
      let flagWin = true;
      for (let i = trackSize + 1; i < boardState.length; i += trackSize + 1) {
        if (boardState[0] !== boardState[i]) {
          boardState[0] !== boardState[i];
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) {
        return boardState[0];
      }
    }

    // Check secondary diagonal
    if (boardState[trackSize - 1] !== 'unmarked') {
      let flagWin = true;

      // The initial i is initialized like that for math reasons.
      // The condition is grid size - 1 to avoid the last cell of the grid
      // passing the condition.
      for (
        let i = trackSize * 2 - 2;
        i < boardState.length - 1;
        i += trackSize - 1
      ) {
        if (boardState[trackSize - 1] !== boardState[i]) {
          flagWin = false;
          break;
        }
      }

      if (flagWin === true) return boardState[trackSize - 1];
    }

    // Check full board with no winner
    if (boardState.every(item => item !== 'unmarked')) return 'draw';
  }

  function displayWinner(winningMarker) {
    if (!winningMarker) return;
    if (winningMarker === 'draw') {
      resultsDisplay.textContent = "It's a draw";
      return;
    }

    let winner = null;
    if (winningMarker === playerOne.marker) winner = playerOne.name;
    if (winningMarker === playerTwo.marker) winner = playerTwo.name;

    resultsDisplay.textContent = `${winner} wins`;
  }

  function endRound() {
    gameContainer.classList.add('fade');
    setTimeout(() => postgameDisplay.classList.add('on'), 100);
  }

  function handleCellClick(event) {
    if (event.target.getAttribute('data-marked') !== 'unmarked') return;

    placeMarker(event);

    const winner = checkWinCondition();

    if (winner) {
      displayWinner(winner);
      endRound();
      return;
    }

    switchTurn();
  }

  function resetBoard() {
    postgameDisplay.classList.remove('on');
    gameContainer.classList.remove('fade');

    if (startSwitch === turnSwitch) switchTurn();
    startSwitch = !startSwitch;

    setUpBoard();
  }

  function switchMarkers() {
    playerMarkers.forEach(item => {
      item.classList.toggle('o');
      item.classList.toggle('x');
    });

    let temp = playerOne.marker;
    playerOne.marker = playerTwo.marker;
    playerTwo.marker = temp;
  }

  function switchTurn() {
    turnSwitch = !turnSwitch;
    playerMarkers.forEach(item => item.classList.toggle('turn'));
  }
})(DOMobj, gameBoard, playerOne, playerTwo);

// TODO:

// Figure out how to turn marker switcher when the game has already started. Maybe reset everything?

// Make sure the switch symbols button disappears on first input

// Add win tracker

// Include grid size adjuster

// Fix mobile view, update current turn styling, button styling,

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
 */
