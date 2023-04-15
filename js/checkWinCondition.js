export function checkWinCondition(currentBoardState) {
  const boardState = currentBoardState;
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
