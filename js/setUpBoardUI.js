export function setUpBoardUI(boardUI, gameBoard) {
  boardUI.forEach((item, i) => {
    item.className = 'cell';
    item.setAttribute('data-marked', 'unmarked');
    gameBoard.setBoardCell(i, 'unmarked');
  });
}