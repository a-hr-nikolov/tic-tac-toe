export function setUpBoardStateAndUI(boardUI, gameBoard) {
  boardUI.forEach((item, i) => {
    item.className = 'cell';
    item.setAttribute('data-marked', 'unmarked');
    gameBoard.setBoardCell(i, 'unmarked');
  });
}

function setLogicCell() {
  gameBoard.setBoardCell(i, 'unmarked');
}

function setUICell(cell) {
  cell.className = 'cell';
  cell.setAttribute('data-marked', 'unmarked');
}
