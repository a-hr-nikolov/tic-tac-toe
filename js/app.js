import { DOMobj } from './DOM.js';
import { initGameBoard } from './gameBoard.js';
import { createPlayer } from './createPlayer.js';
import { setUpBoardStateAndUI } from './setUpBoardStateAndUI.js';
import { checkWinCondition } from './checkWinCondition.js';

const {
  gameContainer,
  resultsDisplay,
  restartBtn,
  playerMarkers,
  switchBtn,
  postgameDisplay,
} = DOMobj;

// Initial board logic and UI setup, nothing here should be run more than once.
// Can eventually be refactored to allow for grid size adjustment.

const gameBoard = initGameBoard('3x3');
const playerOne = createPlayer('Player 1', 'x');
const playerTwo = createPlayer('Player 2', 'o');

// For switching turns on every click
let turnSwitch = true;

// For switching who starts first each round
let startSwitch = true;

const boardUI = [];
for (let i = 0; i < gameBoard.getGridSize(); i++) {
  boardUI[i] = document.createElement('div');
  boardUI[i].setAttribute('data-index', `${i}`);
  boardUI[i].addEventListener('click', handleCellClick);
  gameContainer.appendChild(boardUI[i]);
}

switchBtn.addEventListener('click', switchMarkers);
restartBtn.addEventListener('click', resetBoard);

setUpBoardStateAndUI(boardUI, gameBoard.setBoardCell);

// Functions

function handleCellClick(event) {
  if (event.target.getAttribute('data-marked') !== 'unmarked') return;

  placeMarker(event);

  const winner = checkWinCondition(gameBoard.getBoardState());

  if (winner) {
    displayWinner(winner);
    endRound();
    return;
  }

  switchTurn();
}

function placeMarker({ target }) {
  let marker = null;
  if (turnSwitch) marker = playerOne.marker;
  else marker = playerTwo.marker;

  // Updates display
  target.classList.add(marker);
  target.setAttribute('data-marked', marker);

  // Updates state
  const cellIndex = +target.getAttribute('data-index');
  gameBoard.setBoardCell(cellIndex, marker);
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

function resetBoard() {
  postgameDisplay.classList.remove('on');
  gameContainer.classList.remove('fade');

  if (startSwitch === turnSwitch) switchTurn();
  startSwitch = !startSwitch;

  setUpBoardStateAndUI(boardUI, gameBoard.setBoardCell);
}

function switchMarkers() {
  playerMarkers.forEach(item => {
    item.classList.toggle(playerOne.marker);
    item.classList.toggle(playerTwo.marker);
  });

  let temp = playerOne.marker;
  playerOne.marker = playerTwo.marker;
  playerTwo.marker = temp;
}

function switchTurn() {
  turnSwitch = !turnSwitch;
  playerMarkers.forEach(item => item.classList.toggle('turn'));
}

// TODO:

// Refactor setUpBoardStateAndUI - it shouldn't set up gameboard logic; Perhaps create a function that sets both
// game board and UI, but decouple it from knowing implementation details of gameBoard.

// Figure out how to turn marker switcher when the game has already started. Maybe reset everything?

// Make sure the switch symbols button disappears on first input

// Add win tracker

// Include grid size adjuster

// Fix mobile view, update current turn styling, button styling,

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
 */
