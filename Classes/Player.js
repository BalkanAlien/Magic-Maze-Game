export default class Player {
  constructor(playerNumber, playerPosition, playerRep) {
    this.playerInitialPosition = playerPosition;
    this.playerNumber = playerNumber;
    this.playerPosition = playerPosition;
    this.playerRep = playerRep;
  }
  getPlayerHTMLRep = () =>
    `<div class="player" id="${this.playerNumber}">${this.playerRep}</div>`;
  getPlayerPosition = () => this.playerPosition;
  getPlayerInitialPosition = () => this.playerInitialPosition;
  setPlayerPosition = (newPlayerPosition) =>
    (this.playerPosition = newPlayerPosition);

  setCards = (cards) => (this.cards = cards);
  getCards = () => this.cards;
  getPlayerRep = () => this.playerRep;
  setFinishedAllCardsFlag = (finishedAllCardsFlag) =>
    (this.finishedAllCardsFlag = finishedAllCardsFlag);
  getFinishedAllCardsFlag = () => this.finishedAllCardsFlag;
  getPlayerNumber = () => this.playerNumber;
}
