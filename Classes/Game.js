import Board from "./Board.js";

export default class Game {
  constructor(playersNum, cardsNum, tableBoardDom) {
    this.tableBoardDom = tableBoardDom;
    this.playersNum = playersNum;
    this.boardd = new Board(this.playersNum, cardsNum, tableBoardDom);
  }
}
