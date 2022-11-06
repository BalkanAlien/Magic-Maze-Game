import Game from "./Classes/Game.js";
let tableBoardDom = document.getElementsByTagName("table")[0];
let start = document.getElementById("start");
let startButton = document.getElementById("startGame");

let gameEnv = document.querySelector(".game");

let playersNum = document.querySelector("#playersNum");
let cardsNum = document.querySelector("#cardsNum");

playersNum.addEventListener("input", (e) => {
  cardsNum.max = `${24 / +e.target.value}`;
});

let startGame = document.querySelector("#startGame");

startGame.addEventListener("click", () => {
  start.style.display = "none";
  gameEnv.style.display = "flex";
  let game = new Game(+playersNum.value, +cardsNum.value, tableBoardDom);
});

/* 
Fix the bug of the swapping.

We need to animate the movement of the player.
start the saved game in the local storage.

*/

