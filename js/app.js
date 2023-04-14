/* 

The code below can hardly be considered beautiful, and I wouldn't call it clean either.
That being said, I've kept it as is, because that was the assignment: to use the module
pattern and factory functions to code this game. I would much prefer to use actual ES6
modules, and make my code prettier, but on the other hand, I also want to have this as
a snapshot of how my skills have changed throughout time.

*/

const DOMobj = (function () {
  const gameContainer = document.querySelector('.game-container');
  const postgameDisplay = document.querySelector('.post-game');
  const resultsDisplay = document.querySelector('.results');
  const playerMarkers = document.querySelectorAll('.player-marker');
  const restartBtn = document.querySelector('.restart');
  const switchBtn = document.querySelector('.switch');

  gameContainer.style.height = getComputedStyle(gameContainer).width;

  return {
    gameContainer,
    resultsDisplay,
    restartBtn,
    playerMarkers,
    switchBtn,
    postgameDisplay,
  };
})();

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
    for (let i = 0, gridSize = calcGridSize(); i < gridSize; i++) {
      boardCells[i] = document.createElement('div');
      boardCells[i].classList.add('cell');
      boardCells[i].setAttribute('data-index', `${i}`);
      boardCells[i].setAttribute('data-marked', 'unmarked');
    }
  })();

  function calcGridSize() {
    return (+boardSize.match(/^\d/)) ** 2;
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
    // if (boardCells[index].textContent !== '') return;
    // boardCells[index].innerHTML = mark;
    // if (boardCells[index].classList.)
    boardCells[index].classList.add(mark);
    boardCells[index].setAttribute('data-marked', mark);
  }

  return { getBoardState, setBoardCell };
})('3x3');

function createPlayer(name, marker) {
  return { name, marker };
}

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
  playerOne,
  playerTwo
) => {
  // Switches turns on every click
  let turnSwitch = true;

  // Switches who starts first each round
  let startSwitch = true;

  let board = gameBoard.getBoardState();

  restartBtn.addEventListener('click', restartGame);
  switchBtn.addEventListener('click', switchMarkers);

  const createBoard = (function createBoard() {
    board.forEach(item => {
      item.addEventListener('click', onClick);
      item.className = 'cell';
      gameContainer.appendChild(item);
    });

    return createBoard;
  })();

  function placeSymbol({ target }) {
    let marker = null;
    if (turnSwitch) marker = playerOne.marker;
    else marker = playerTwo.marker;

    const cellIndex = +target.getAttribute('data-index');
    gameBoard.setBoardCell(cellIndex, marker);
  }

  function checkWinCondition() {
    // To only have to reference boardContent, not board[i].textContent
    // Though this may actually be hurting performance. Maybe refactor?
    const boardContent = board.map(item => item.getAttribute('data-marked'));

    // Check rows
    for (
      let i = 0;
      i < boardContent.length;
      i += Math.sqrt(boardContent.length)
    ) {
      let flagWin = true;
      if (boardContent[i] === 'unmarked') continue;
      for (let j = i + 1; j < Math.sqrt(boardContent.length) + i; j++) {
        if (boardContent[i] !== boardContent[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) return boardContent[i];
    }

    // Check columns
    for (let i = 0; i < Math.sqrt(boardContent.length); i++) {
      let flagWin = true;
      if (boardContent[i] === 'unmarked') continue;
      for (
        let j = i + Math.sqrt(boardContent.length);
        j < boardContent.length;
        j += Math.sqrt(boardContent.length)
      ) {
        if (boardContent[i] !== boardContent[j]) {
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) return boardContent[i];
    }

    // Check main diagonal
    if (boardContent[0] !== 'unmarked') {
      let flagWin = true;
      for (
        let i = Math.sqrt(boardContent.length) + 1;
        i < boardContent.length;
        i += Math.sqrt(boardContent.length) + 1
      ) {
        if (boardContent[0] !== boardContent[i]) {
          boardContent[0] !== boardContent[i];
          flagWin = false;
          break;
        }
      }
      if (flagWin === true) {
        return boardContent[0];
      }
    }

    // Check secondary diagonal
    if (boardContent[Math.sqrt(boardContent.length) - 1] !== 'unmarked') {
      let flagWin = true;

      // The initial i is initialized like that for math reasons.
      // The condition is grid size - 1 to avoid the last cell of the grid
      // passing the condition.
      for (
        let i = Math.sqrt(boardContent.length) * 2 - 2;
        i < boardContent.length - 1;
        i += Math.sqrt(boardContent.length) - 1
      ) {
        if (
          boardContent[Math.sqrt(boardContent.length) - 1] !== boardContent[i]
        ) {
          flagWin = false;
          break;
        }
      }

      if (flagWin === true)
        return boardContent[Math.sqrt(boardContent.length) - 1];
    }

    // Check full board with no winner
    if (boardContent.every(item => item !== 'unmarked')) return 'draw';
  }

  function displayWinner(winningMarker) {
    if (!winningMarker) return;
    if (winningMarker === 'draw') {
      resultsDisplay.textContent = "It's a draw";
      return;
    }

    console.log(winningMarker);
    console.log(playerOne.marker);

    let winner = null;
    if (winningMarker === playerOne.marker) winner = playerOne.name;
    if (winningMarker === playerTwo.marker) winner = playerTwo.name;

    resultsDisplay.textContent = `${winner} wins`;
  }

  function stopGame() {
    gameContainer.classList.add('fade');
    setTimeout(() => postgameDisplay.classList.add('on'), 200);
    // postgameDisplay.classList.add('on');
    board.forEach(item => item.removeEventListener('click', onClick));
  }

  function onClick(event) {
    if (event.target.getAttribute('data-marked') !== 'unmarked') return;

    placeSymbol(event);

    const winner = checkWinCondition();

    if (winner) {
      displayWinner(winner);
      stopGame();
      return;
    }

    switchTurn();
  }

  function restartGame() {
    postgameDisplay.classList.remove('on');
    gameContainer.classList.remove('fade');
    board.forEach(item => item.setAttribute('data-marked', 'unmarked'));
    if (startSwitch === turnSwitch) switchTurn();
    startSwitch = !startSwitch;
    createBoard();
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

  return { onClick };
})(DOMobj, playerOne, playerTwo);

// TODO:

// Figure out how to turn marker switcher when the game has already started. Maybe reset everything?

// Include grid size adjuster

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!
 */
