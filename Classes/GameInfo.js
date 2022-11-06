export default function gameInfo(currentPlayer) {
  let gameInfoDom = document.getElementById("gameInfo");
  let playerTreasure =
    currentPlayer.getCards().length === 0
      ? "Finished"
      : currentPlayer.getCards()[0].getTreasure();
  gameInfoDom.innerHTML = `
    <p>current player: ${currentPlayer.getPlayerRep()}</p>
    <p>Treasure to find: ${playerTreasure}</p>
    `;
}
