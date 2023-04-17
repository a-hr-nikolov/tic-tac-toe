export function createPlayer(name, marker) {
  let wins = 0;

  function incrementWin() {
    wins++;
  }

  function getWins() {
    return wins;
  }
  return { name, marker, incrementWin, getWins };
}
