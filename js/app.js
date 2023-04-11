const DOMobj = (function () {
  const gameContainer = document.querySelector('.game-container');
  const resultsDisplay = document.querySelector('.results');
  const restartBtn = document.querySelector('.restart');

  gameContainer.style.height = getComputedStyle(gameContainer).width;

  return { gameContainer, resultsDisplay, restartBtn };
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
    boardCells[index].innerHTML = mark;
  }

  return { getBoardState, setBoardCell };
})('3x3');

const displayController = (({ gameContainer, resultsDisplay, restartBtn }) => {
  let turnSwitch = true;
  let board = gameBoard.getBoardState();
  const oMark = '<i class="fa-solid fa-o"></i>';
  const xMark = '<i class="fa-solid fa-xmark"></i>';

  restartBtn.addEventListener('click', restartGame);

  const createBoard = (function createBoard() {
    gameContainer.textContent = '';

    board.forEach(item => {
      item.textContent = '';
      item.addEventListener('click', onClick);
      gameContainer.appendChild(item);
    });

    return createBoard;
  })();

  function placeSymbol({ target }) {
    if (target.textContent !== '') return;

    let mark = null;
    if (turnSwitch) mark = xMark;
    else mark = oMark;

    const cellIndex = +target.getAttribute('data-index');
    gameBoard.setBoardCell(cellIndex, mark);

    turnSwitch = !turnSwitch;
  }

  function checkWinCondition() {
    // To only have to reference boardContent, not board[i].textContent
    // Though this may actually be hurting performance. Maybe refactor?
    const boardContent = board.map(item => item.innerHTML);

    // Check rows
    for (
      let i = 0;
      i < boardContent.length;
      i += Math.sqrt(boardContent.length)
    ) {
      let flagWin = true;
      if (boardContent[i] === '') continue;
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
      if (boardContent[i] === '') continue;
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
    if (boardContent[0] !== '') {
      let flagWin = true;
      for (
        let i = Math.sqrt(boardContent.length) + 1;
        i < boardContent.length;
        i += Math.sqrt(boardContent.length) + 1
      ) {
        if (boardContent[0] !== boardContent[i]) {
          console.log(boardContent[0]);
          console.log('This is ' + boardContent[i]);
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
    if (boardContent[Math.sqrt(boardContent.length) - 1] !== '') {
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
    if (boardContent.every(item => item !== '')) return 'draw';
  }

  function displayWinner(winnerString) {
    if (!winnerString) return;
    if (winnerString === 'draw') {
      resultsDisplay.textContent = "It's a draw";
      return;
    }
    resultsDisplay.innerHTML = `${winnerString} wins`;
  }

  function stopGame() {
    board.forEach(item => item.removeEventListener('click', onClick));
    restartBtn.classList.remove('off');
  }

  function onClick(event) {
    placeSymbol(event);

    const winner = checkWinCondition();

    if (!winner) return;

    displayWinner(winner);
    stopGame();
  }

  function restartGame() {
    restartBtn.classList.add('off');
    resultsDisplay.textContent = 'Who will win?';
    createBoard();
  }

  return { onClick };
})(DOMobj);

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

// Include grid size adjuster

// Add a symbol selector for player 1 and player 2 that automatically switches symbols when one is selected.
// Add a highlighter for whose turn it is. Turns should switch based on who started first last game.

/* Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!
 */
