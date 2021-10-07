//import
import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
/**
 * Global variables
 */

// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "O", "O", "X"]));
// console.log(checkGameStatus(["O", "O", "O", "O", "X", "O", "O", "O", "X"]));
// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "X", "", "O"]));
// console.log(checkGameStatus(["X", "O", "O", "", "X", "", "", "O", "X"]));

let currentTurn = TURN.CROSS;
// let isGameEnded = false;
let cellValues = new Array(9).fill("");
let gameStatus = GAME_STATUS.PLAYING;

function updateGameStatus(newGameStutus) {
  gameStatus = newGameStutus;
  const gameStatusElenment = getGameStatusElement();
  if (gameStatusElenment) gameStatusElenment.textContent = gameStatus;
  alert(gameStatus);
}
function showReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.add("show");
}
function hideReplayButton() {
  const replayButtonElement = getReplayButtonElement();
  if (replayButtonElement) replayButtonElement.classList.remove("show");
}
function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("winpostions error");
  }
  for (let position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function tonggleTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}
function handleCellClick(cell, index) {
  const isClick =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isClick || isEndGame) return;
  cell.classList.add(currentTurn);

  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }

    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }

    default:
      break;
  }
  tonggleTurn();
  // console.log("click", cell, index);
}
function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
function resetGame() {
  currentTurn = TURN.CIRCLE;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");
  updateGameStatus(GAME_STATUS.PLAYING);
  hideReplayButton();

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  const cellElementList = getCellElementList();
  for (let cellElement of cellElementList) {
    cellElement.className = "";
  }

  highlightWinCells([]);
}
function initReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
}
(() => {
  initCellElementList();
  initReplayButton();
})();
