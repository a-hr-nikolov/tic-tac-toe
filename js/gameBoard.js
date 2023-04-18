/*

Below I have two ways of implementing the creation of a new game board. Initially,
I was using the factory function, but decided to switch to a class later on. I still
wanted to keep the factory function though, just to keep it as a history artifact.

*/

export class GameBoard {
  #boardState;
  #gridSize;
  constructor(gridSizeString) {
    this.#boardState = [];
    this.#gridSize = gridSizeString;
  }

  getBoardState() {
    return [...this.#boardState];
  }

  getGridSize() {
    return (+this.#gridSize.match(/^\d/)) ** 2;
  }

  setBoardCell = (index, marker) => {
    this.#boardState[index] = marker;
  };
}

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
