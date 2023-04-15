export const initGameBoard = gridSizeString => {
  let boardState = [];

  function calcGridSize() {
    return (+gridSizeString.match(/^\d/)) ** 2;
  }

  function getBoardState() {
    return [...boardState];
  }

  function getGridSize() {
    return calcGridSize();
  }

  function setBoardCell(index, marker) {
    boardState[index] = marker;
  }

  return { getBoardState, getGridSize, setBoardCell };
};
