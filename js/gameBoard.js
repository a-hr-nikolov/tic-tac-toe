/*

Below I have two ways of implementing the creation of a new game board. Initially,
I was using the factory function, but decided to switch to a class later on. However,
a class isn't really necessary here, and both can be used easily. So I defaulted back
to a factory function.

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

export const createGameBoard = gridSizeString => {
  let boardState = [];

  function getBoardState() {
    return [...boardState];
  }

  function getGridSize() {
    return (+gridSizeString.match(/^\d/)) ** 2;
  }

  function setBoardCell(index, marker) {
    boardState[index] = marker;
  }

  return { getBoardState, getGridSize, setBoardCell };
};
