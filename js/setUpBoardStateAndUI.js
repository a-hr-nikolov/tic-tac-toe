/*

While this functions breaks the single responsibility principle, it is small enough and
I think it is worth it to keep the code concise and clear. 

*/

export function setUpBoardStateAndUI(boardUI, setCellState) {
  boardUI.forEach((item, i) => {
    item.className = 'cell';
    item.setAttribute('data-marked', 'unmarked');
    setCellState(i, 'unmarked');
  });
}
