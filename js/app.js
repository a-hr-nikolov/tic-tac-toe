import { DOM } from './DOM.js';
import { initGameBoard } from './gameBoard.js';
import { createPlayer } from './createPlayer.js';
import { initLogicAndUI } from './initLogicAndUI.js';
import { checkWinCondition } from './checkWinCondition.js';

// Initial board logic and UI setup, nothing here should be run more than once.
// Can eventually be refactored to allow for grid size adjustment.

const gameBoard = initGameBoard('3x3');
const playerOne = createPlayer('Player 1', 'x');
const playerTwo = createPlayer('Player 2', 'o');

// For switching turns on every click
let turnSwitch = true;

// Switches each round
let whoGoesFirstSwitch = true;

const boardUI = [];
for (let i = 0; i < gameBoard.getGridSize(); i++) {
  boardUI[i] = document.createElement('div');
  boardUI[i].addEventListener('click', handleCellClick);
  DOM.boardUIContainer.appendChild(boardUI[i]);
}

DOM.swapBtn.addEventListener('click', swapPlayerMarkers);
DOM.restartBtn.addEventListener('click', resetBoard);
DOM.boardUIContainer.addEventListener('click', hideSwapButton, { once: true });

initLogicAndUI(boardUI, gameBoard.setBoardCell);

// Functions

/*

Most of the functions break the single responsibility principle, and they are not pure
either. That being said, I think their functionality is clear and further abstraction
will rather confuse things. I may be wrong, but that's my current reasoning.

*/

function handleCellClick(event) {
  const index = getIndexOfCell(event.target);
  if (gameBoard.getBoardState()[index] !== 'unmarked') return;

  putMarker(event.target);

  const winner = checkWinCondition(gameBoard.getBoardState());

  if (winner) {
    handleWin(winner);
    endRound();
    return;
  }

  switchTurn();
}

function getIndexOfCell(target) {
  return [...DOM.boardUIContainer.children].indexOf(target);
}

function putMarker(target) {
  let marker = null;
  if (turnSwitch) marker = playerOne.marker;
  else marker = playerTwo.marker;

  updateBoardUI(target, marker);
  updateCellState(target, marker);
}

function updateBoardUI(target, marker) {
  target.classList.add(marker);
}

function updateCellState(target, marker) {
  const index = getIndexOfCell(target);
  gameBoard.setBoardCell(index, marker);
}

function handleWin(winningMarker) {
  if (!winningMarker) return;

  if (winningMarker === 'draw') {
    DOM.resultsDisplay.textContent = "It's a draw";
    return;
  }

  let winner = null;
  if (winningMarker === playerOne.marker) {
    winner = playerOne.name;
    playerOne.incrementWin();
    DOM.p1WinDisplay.textContent = playerOne.getWins();
  }
  if (winningMarker === playerTwo.marker) {
    winner = playerTwo.name;
    playerTwo.incrementWin();
    DOM.p2WinDisplay.textContent = playerTwo.getWins();
  }

  DOM.resultsDisplay.textContent = `${winner} wins`;
}

function endRound() {
  DOM.boardUIContainer.classList.add('fade');
  setTimeout(() => DOM.postgameDisplay.classList.add('on'), 100);
}

function resetBoard() {
  DOM.postgameDisplay.classList.remove('on');
  DOM.boardUIContainer.classList.remove('fade');

  if (whoGoesFirstSwitch === turnSwitch) switchTurn();
  whoGoesFirstSwitch = !whoGoesFirstSwitch;

  initLogicAndUI(boardUI, gameBoard.setBoardCell);
  DOM.swapBtn.classList.remove('hidden');
  DOM.boardUIContainer.addEventListener('click', hideSwapButton, {
    once: true,
  });
}

function switchTurn() {
  turnSwitch = !turnSwitch;
  DOM.playerMarkers.forEach(item => item.classList.toggle('turn'));
}

function swapPlayerMarkers() {
  swapPlayerMarkerState();
  swapPlayerMarkerDisplay();
}

function swapPlayerMarkerState() {
  let temp = playerOne.marker;
  playerOne.marker = playerTwo.marker;
  playerTwo.marker = temp;
}

function swapPlayerMarkerDisplay() {
  DOM.playerMarkers.forEach(item => {
    item.classList.toggle(playerOne.marker);
    item.classList.toggle(playerTwo.marker);
  });
}

function hideSwapButton() {
  DOM.swapBtn.classList.add('hidden');
}

// TODO:

// Currently 'x' and 'o' are hardcoded. I need to decouple them from how the logic works.
// My logic shouldn't depend on what the player markers are per se, but right now it does.
// It depends on them being 'x' and 'o' precisely.

// Include grid size adjuster

// Fix mobile view, update current turn styling, button styling,

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
 */
