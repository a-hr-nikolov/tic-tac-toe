const gameContainer = document.querySelector('.game-container');
const postgameDisplay = document.querySelector('.post-game');
const resultsDisplay = document.querySelector('.results');
const playerMarkers = document.querySelectorAll('.player-marker');
const restartBtn = document.querySelector('.restart');
const swapBtn = document.querySelector('.swap');

gameContainer.style.height = getComputedStyle(gameContainer).width;

export const DOMobj = {
  gameContainer,
  resultsDisplay,
  restartBtn,
  playerMarkers,
  swapBtn,
  postgameDisplay,
};
