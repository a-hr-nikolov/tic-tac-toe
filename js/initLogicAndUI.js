/*

While this functions breaks the single responsibility principle, it is small enough and
I think it is worth it to keep the code concise and clear. 

*/

export function initLogicAndUI(boardUI, setCellState) {
  boardUI.forEach((item, i) => {
    item.className = 'cell';
    setCellState(i, 'unmarked');
  });
}
