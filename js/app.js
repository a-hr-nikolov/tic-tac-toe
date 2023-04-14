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
  let boardSize = boardSizeString;
  let boardCells = [];

  (function initBoardState() {
    boardCells = [];
    for (let i = 0, gridSize = calcGridSize(); i < gridSize; i++) {
      boardCells[i] = 'unmarked';
    }
  })();

  function calcGridSize() {
    return (+boardSize.match(/^\d/)) ** 2;
  }

  // I can simply export boardCells, but with the function below I return a reference
  // meaning that while the boardCells array can be mutated, boardCells will not stop
  // referencing it (i.e. boardCells as a variable is protected). This way we ensure
  // we at least always have a reference to the array, even if it gets mutated.

  function getBoardState() {
    return [...boardCells];
  }

  function setBoardCell(index, marker) {
    boardCells[index] = marker;
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
  gameBoard,
  playerOne,
  playerTwo
) => {
  // Switches turns on every click
  let turnSwitch = true;

  // Switches who starts first each round
  let startSwitch = true;

  let board = gameBoard.getBoardState().map((item, i) => {
    let div = document.createElement('div');
    div.setAttribute('data-index', `${i}`);
    div.setAttribute('data-marked', item);
    div.className = 'cell';
    div.addEventListener('click', handleCellClick);
    gameContainer.appendChild(div);
    return div;
  });

  switchBtn.addEventListener('click', switchMarkers);
  restartBtn.addEventListener('click', restartGame);

  const createBoard = (function createBoard() {
    board.forEach(item => {
      item.className = 'cell';
    });

    return createBoard;
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

  function stopGame() {
    gameContainer.classList.add('fade');
    setTimeout(() => postgameDisplay.classList.add('on'), 100);
  }

  function handleCellClick(event) {
    if (event.target.getAttribute('data-marked') !== 'unmarked') return;

    placeMarker(event);

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

    board.forEach((item, i) => {
      item.setAttribute('data-marked', 'unmarked');
      item.className = 'cell';
      gameBoard.setBoardCell(i, 'unmarked');
    });

    if (startSwitch === turnSwitch) switchTurn();
    startSwitch = !startSwitch;
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

  return { handleCellClick };
})(DOMobj, gameBoard, playerOne, playerTwo);

// TODO:

// Figure out how to turn marker switcher when the game has already started. Maybe reset everything?

// Include grid size adjuster

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!
 */
