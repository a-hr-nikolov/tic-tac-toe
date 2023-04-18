const boardUIContainer = document.querySelector('.game-container');
const postgameDisplay = document.querySelector('.post-game');
const resultsDisplay = document.querySelector('.results');
const playerMarkers = document.querySelectorAll('.player-marker');
const restartBtn = document.querySelector('.restart');
const swapBtn = document.querySelector('.swap');
const p1WinDisplay = document.querySelector('#p1wins');
const p2WinDisplay = document.querySelector('#p2wins');

boardUIContainer.style.height = getComputedStyle(boardUIContainer).width;

export const DOMobj = {
  boardUIContainer,
  resultsDisplay,
  restartBtn,
  playerMarkers,
  swapBtn,
  postgameDisplay,
  p1WinDisplay,
  p2WinDisplay,
};
