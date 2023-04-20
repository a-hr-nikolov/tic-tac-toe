import { DOM } from './DOM.js';
import { createGameBoard } from './gameBoard.js';
import { createPlayer } from './createPlayer.js';
import { initLogicAndUI } from './initLogicAndUI.js';
import { checkWinCondition } from './checkWinCondition.js';

// Initial board logic and UI setup, nothing here should be run more than once.
// Can eventually be refactored to allow for grid size adjustment.

const gameBoard = createGameBoard('3x3');
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
  boardUI[i].setAttribute('data-index', i);
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
  const index = event.target.getAttribute('data-index');

  // Guard clause to prevent from cells being overwritten
  if (gameBoard.getBoardState()[index] !== 'unmarked') return;

  putMarker(event.target, index, getMarker());

  const winner = checkWinCondition(gameBoard.getBoardState());

  if (winner) {
    handleWin(winner);
    endRound();
    return;
  }

  switchTurn();
}

function getMarker() {
  if (turnSwitch) return playerOne.marker;
  else return playerTwo.marker;
}

function putMarker(target, index, marker) {
  // Puts marker in internal state object
  gameBoard.setBoardCell(index, marker);

  // Puts marker on board UI
  target.classList.add(marker);
}

function handleWin(winningMarker) {
  if (!winningMarker) return;

  if (
    winningMarker !== playerOne.marker &&
    winningMarker !== playerTwo.marker
  ) {
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
  // Updates state
  let temp = playerOne.marker;
  playerOne.marker = playerTwo.marker;
  playerTwo.marker = temp;

  // Updates UI
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

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
 */
