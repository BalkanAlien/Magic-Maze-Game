export default class Card {
  constructor(treasure) {
    this.treasure = treasure;
  }
  getTreasure = () => this.treasure;
  getCardHTMLRep = () => `<div class="card">${this.treasure}</div>`;
}
