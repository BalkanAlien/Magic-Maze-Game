import Card from "./Card.js";
import Game from "./Game.js";
import gameInfo from "./GameInfo.js";
import Player from "./Player.js";
import Room from "./Room.js";

export default class Board {
  constructor(playersNum, cardsNum, tableBoardDom) {
    this.tableBoardDom = tableBoardDom;
    this.playersNum = playersNum;
    this.cardsNum = cardsNum;
    this.currentPlayerTurn = 1;
    this.targetRoomClicked = true;
    this.generateBoard();
    this.boardToHTML();
    this.tableBoardDom = tableBoardDom.getElementsByTagName("tbody")[1];
    this.createPlayers(playersNum);
    this.putPlayerInDom();
    this.initializeCards();
    this.putTreasuresInDom();
    gameInfo(this.players[0]);
    this.listenToArrows();
    this.listenForExtraRoomClick();
    this.listenToPlayerTarget();
  }
  generateBoard = () => {
    let board = [];
    let roomsType = ["B", "S", "T"];
    let rotations = [90, 180, 270, 360];
    let rooms = [];
    for (let i = 0; i < 13; i++) {
      let randomDeg = Math.floor(Math.random() * 4);
      rooms.push(new Room("T", rotations[randomDeg]));
    }
    for (let i = 0; i < 15; i++) {
      let randomDeg = Math.floor(Math.random() * 4);
      rooms.push(new Room("B", rotations[randomDeg]));
    }
    for (let i = 0; i < 6; i++) {
      let randomDeg = Math.floor(Math.random() * 4);
      rooms.push(new Room("S", rotations[randomDeg]));
    }
    this.shuffle(rooms);
    let k = 0;
    for (let i = 0; i < 7; i++) {
      let tempRow = [];
      for (let j = 0; j < 7; j++) {
        if (!(i % 2 == 0 && j % 2 == 0)) {
          let currentRoom = rooms[k];
          currentRoom.setRoomPosition([i, j]);
          tempRow.push(currentRoom);
          k++;
        } else {
          tempRow.push("");
        }
      }
      board.push(tempRow);
    }

    board[0][0] = new Room("B", 360, [0, 0]);
    board[0][2] = new Room("T", 360, [0, 2]);
    board[0][4] = new Room("T", 360, [0, 4]);
    board[0][6] = new Room("B", 90, [0, 6]);

    board[2][0] = new Room("T", 270, [2, 0]);
    board[2][2] = new Room("T", 270, [2, 2]);
    board[2][4] = new Room("T", 360, [2, 4]);
    board[2][6] = new Room("T", 90, [2, 6]);

    board[4][0] = new Room("T", 270, [4, 0]);
    board[4][2] = new Room("T", 180, [4, 2]);
    board[4][4] = new Room("T", 90, [4, 4]);
    board[4][6] = new Room("T", 90, [4, 6]);

    board[6][0] = new Room("B", 270, [6, 0]);
    board[6][2] = new Room("T", 180, [6, 2]);
    board[6][4] = new Room("T", 180, [6, 4]);
    board[6][6] = new Room("B", 180, [6, 6]);

    this.extraRoom = rooms[rooms.length - 1];
    this.extraRoomDom = document
      .getElementById("extraRoom")
      .getElementsByTagName("tr")[0];
    this.extraRoomDom.innerHTML = this.extraRoom.getRoomHTMLRep();
    this.board = board;
  };
  initializeCards = () => {
    let listOfTreasures = [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶",
      "🫑",
    ];
    let cards = [];
    for (let i = 0; i < this.cardsNum * this.playersNum; i++) {
      cards.push(new Card(listOfTreasures[i]));
    }

    let j = 0;
    for (
      let i = 0;
      i < this.cardsNum * this.playersNum;
      i += this.cardsNum, j++
    ) {
      this.players[j].setCards(cards.slice(i, this.cardsNum + i));
    }
  };
  putTreasuresInDom = () => {
    let occPositions = [];
    this.players.forEach((player) => {
      player.getCards().forEach((card) => {
        let row = Math.floor(Math.random() * 7);
        let col = Math.floor(Math.random() * 7);

        while (
          (row == 0 && col == 0) ||
          (row == 0 && col == 6) ||
          (row == 6 && col == 0) ||
          (row == 6 && col == 6) ||
          occPositions.includes(`${row}${col}`)
        ) {
          row = Math.floor(Math.random() * 7);
          col = Math.floor(Math.random() * 7);
        }
        occPositions.push(`${row}${col}`);
        this.tableBoardDom
          .getElementsByTagName("tr")
          [row].getElementsByTagName("td")[col].innerHTML +=
          card.getCardHTMLRep();
        this.board[row][col].setTreasure(card.getTreasure());
      });
    });
  };
  createPlayers = (numberPlayers) => {
    this.players = [];
    let playersPosition = [
      [0, 0, "😀"],
      [0, 6, "😰"],
      [6, 0, "🥵"],
      [6, 6, "💃🏽"],
    ];
    for (let i = 0; i < numberPlayers; i++) {
      this.players.push(
        new Player(
          i + 1,
          [playersPosition[i][0], playersPosition[i][1]],
          playersPosition[i][2]
        )
      );
      this.board[playersPosition[i][0]][playersPosition[i][1]].setRoomHasPlayer(
        true
      );
    }
  };
  putPlayerInDom = () => {
    for (let i = 0; i < this.players.length; i++) {
      let currentPlayerPosition = this.players[i].getPlayerPosition();
      let currentPlayerHTMLRep = this.players[i].getPlayerHTMLRep();
      this.tableBoardDom
        .getElementsByTagName("tr")
        [currentPlayerPosition[0]].getElementsByTagName("td")
        [currentPlayerPosition[1]].getElementsByClassName(
          "players"
        )[0].innerHTML += currentPlayerHTMLRep;
    }
  };

  listenToPLayerMove = () => {
    let playerInDom = document.getElementById(`${this.currentPlayerTurn}`);
    playerInDom.addEventListener(
      "click",
      () => {
        let playerPosition =
          this.players[+playerInDom.id - 1].getPlayerPosition();
        this.traverseBoard(this.board[playerPosition[0]][playerPosition[1]]);
      },
      { once: true }
    );
  };
  listenToArrows = () => {
    let topArrows = document.getElementsByClassName("top-arrows")[0];
    let downArrows = document.getElementsByClassName("down-arrows")[0];
    let leftArrows = document.getElementsByClassName("left-arrow");
    let rightArrows = document.getElementsByClassName("right-arrow");
    [
      topArrows.getElementsByTagName("tr"),
      downArrows.getElementsByTagName("tr"),
      leftArrows,
      rightArrows,
    ].forEach((arrowsArr) => {
      [...arrowsArr].forEach((arrow, index) => {
        arrow
          .getElementsByTagName("button")[0]
          .addEventListener("click", () => {
            this.moveRooms(arrow.className, index);
            this.freezeUnFreezeArrowButtons();
            this.listenToPLayerMove();
          });
      });
    });
  };
  freezeUnFreezeArrowButtons = () => {
    let topArrows = document.getElementsByClassName("top-arrows")[0];
    let downArrows = document.getElementsByClassName("down-arrows")[0];
    let leftArrows = document.getElementsByClassName("left-arrow");
    let rightArrows = document.getElementsByClassName("right-arrow");
    [
      topArrows.getElementsByTagName("tr"),
      downArrows.getElementsByTagName("tr"),
      leftArrows,
      rightArrows,
    ].forEach((arrowsArr) => {
      [...arrowsArr].forEach((arrow) => {
        let arrowButton = arrow.getElementsByTagName("button")[0];
        arrowButton.disabled = !arrowButton.disabled;
      });
    });
  };
  listenToPlayerTarget = () => {
    let tableRows = this.tableBoardDom.getElementsByTagName("tr");
    [...tableRows].forEach((row, index1) => {
      [...row.getElementsByTagName("td")].forEach((td, index2) => {
        td.addEventListener("click", async () => {
          let currentPlayer = document.getElementById(this.currentPlayerTurn);
          let playerInTarget = this.tableBoardDom
            .getElementsByTagName("tr")
            [index1].getElementsByTagName("td")
            [index2].getElementsByClassName("players")[0]
            .getElementsByClassName("player")[0];

          if (
            td.getElementsByTagName("img")[0].style.border ==
              "1px solid rgb(255, 255, 255)" &&
            this.targetRoomClicked &&
            currentPlayer !== playerInTarget
          ) {
            console.log("target");

            this.targetRoomClicked = false;
            let currentPlayer = this.players[this.currentPlayerTurn - 1];
            let currentPlayerCards = currentPlayer.getCards();

            if (
              this.board[index1][index2].getIsTreasure() &&
              currentPlayerCards[0].getTreasure() ==
                this.board[index1][index2].getTreasure()
            ) {
              currentPlayerCards.shift();

              if (currentPlayerCards.length == 0) {
                currentPlayer.setFinishedAllCardsFlag(true);
              }
            }
            // await this.animatePlayer(currentPlayer, [index1, index2]);
            this.movePlayer(index1, index2);
            this.targetRoomClicked = true;
          }
        });
      });
    });
  };

  // animatePlayer = async (currentPlayer, targetPosition) => {
  //   let currentPlayerPosition = currentPlayer.getPlayerPosition();
  //   currentPlayer = document.getElementById(currentPlayer.getPlayerNumber());
  //   let targetIndexTop =
  //     targetPosition[0] > currentPlayerPosition[0]
  //       ? (targetPosition[0] - currentPlayerPosition[0]) * 100
  //       : 0;
  //   let targetIndexLeft =
  //     targetPosition[1] > currentPlayerPosition[1]
  //       ? (targetPosition[1] - currentPlayerPosition[1]) * 110
  //       : 0;

  //   let targetIndexRight =
  //     targetPosition[1] < currentPlayerPosition[1]
  //       ? (currentPlayerPosition[1] - targetPosition[1]) * 110
  //       : 0;
  //   let targetIndexBottom =
  //     targetPosition[0] < currentPlayerPosition[0]
  //       ? (currentPlayerPosition[0] - targetPosition[0]) * 100
  //       : 0;

  //   for (let i = 0; i < targetIndexTop; i += 2) {
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     currentPlayer.style.top = i + "px";
  //   }
  //   for (let i = 0; i < targetIndexLeft; i += 2) {
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     currentPlayer.style.left = i + "px";
  //   }
  //   for (let i = 0; i < targetIndexRight; i += 2) {
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     currentPlayer.style.right = i + "px";
  //   }
  //   for (let i = 0; i < targetIndexBottom; i += 2) {
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     currentPlayer.style.bottom = i + "px";
  //   }
  //   currentPlayer.style.top = "0px";
  //   currentPlayer.style.left = "0px";
  //   currentPlayer.style.right = "0px";
  //   currentPlayer.style.bottom = "0px";
  // };
  movePlayer = (index1, index2) => {
    let player = document.getElementById(`${this.currentPlayerTurn}`);
    let currentPlayerPosition =
      this.players[this.currentPlayerTurn - 1].getPlayerPosition();
    this.board[currentPlayerPosition[0]][
      currentPlayerPosition[1]
    ].setRoomHasPlayer(false);

    this.players[this.currentPlayerTurn - 1].setPlayerPosition([
      index1,
      index2,
    ]);
    player.parentNode.removeChild(player);
    this.tableBoardDom
      .getElementsByTagName("tr")
      [index1].getElementsByTagName("td")
      [index2].getElementsByClassName("players")[0]
      .appendChild(player);
    this.board[index1][index2].setRoomHasPlayer(true);
    this.removeHighlight();
    let currentPlayer = this.players[this.currentPlayerTurn - 1];
    if (
      currentPlayer.getFinishedAllCardsFlag() &&
      currentPlayer.getPlayerInitialPosition()[0] == index1 &&
      currentPlayer.getPlayerInitialPosition()[1] == index2
    ) {
      this.gameOver(currentPlayer);
    } else {
      this.changePlayerTurn();
    }
  };

  traverseBoard = (sourceRoom, indexToIgnore, alreadyVistedRooms = []) => {
    let sourceRoomPosition = sourceRoom.getRoomPosition();
    let roomsToVisit = [
      [sourceRoomPosition[0] - 1, sourceRoomPosition[1]],
      [sourceRoomPosition[0], sourceRoomPosition[1] + 1],
      [sourceRoomPosition[0] + 1, sourceRoomPosition[1]],
      [sourceRoomPosition[0], sourceRoomPosition[1] - 1],
    ];
    for (let i = 0; i < roomsToVisit.length; i++) {
      let roomToVisitRow = roomsToVisit[i][0];
      let roomToVisitCol = roomsToVisit[i][1];

      if (
        roomToVisitRow >= 0 &&
        roomToVisitRow < 7 &&
        roomToVisitCol >= 0 &&
        roomToVisitCol < 7 &&
        i !== indexToIgnore &&
        !alreadyVistedRooms.includes(this.board[roomToVisitRow][roomToVisitCol])
      ) {
        let sourceRoomAvailability = [...sourceRoom.getAvailability()];
        let sourceRoomRotationDeg = sourceRoom.getRoomRotationDeg();
        let targetRoomAvailability = [
          ...this.board[roomToVisitRow][roomToVisitCol].getAvailability(),
        ];
        let targetRoomRotationDeg =
          this.board[roomToVisitRow][roomToVisitCol].getRoomRotationDeg();
        let targetRoom = this.board[roomToVisitRow][roomToVisitCol];

        this.rotateArray(sourceRoomAvailability, sourceRoomRotationDeg / 90);
        this.rotateArray(targetRoomAvailability, targetRoomRotationDeg / 90);
        if (i == 0 && sourceRoomAvailability[0] && targetRoomAvailability[2]) {
          this.tableBoardDom
            .getElementsByTagName("tr")
            [roomToVisitRow].getElementsByTagName("td")
            [roomToVisitCol].getElementsByTagName("img")[0].style.border =
            "1px solid rgb(255, 255, 255)";
          alreadyVistedRooms.push(this.board[roomToVisitRow][roomToVisitCol]);
          this.traverseBoard(targetRoom, 2, alreadyVistedRooms);
        }
        if (i == 1 && sourceRoomAvailability[1] && targetRoomAvailability[3]) {
          this.tableBoardDom
            .getElementsByTagName("tr")
            [roomToVisitRow].getElementsByTagName("td")
            [roomToVisitCol].getElementsByTagName("img")[0].style.border =
            "1px solid rgb(255, 255, 255)";
          alreadyVistedRooms.push(this.board[roomToVisitRow][roomToVisitCol]);

          this.traverseBoard(targetRoom, 3, alreadyVistedRooms);
        }
        if (i == 2 && sourceRoomAvailability[2] && targetRoomAvailability[0]) {
          this.tableBoardDom
            .getElementsByTagName("tr")
            [roomToVisitRow].getElementsByTagName("td")
            [roomToVisitCol].getElementsByTagName("img")[0].style.border =
            "1px solid rgb(255, 255, 255)";
          alreadyVistedRooms.push(this.board[roomToVisitRow][roomToVisitCol]);

          this.traverseBoard(targetRoom, 0, alreadyVistedRooms);
        }
        if (i == 3 && sourceRoomAvailability[3] && targetRoomAvailability[1]) {
          this.tableBoardDom
            .getElementsByTagName("tr")
            [roomToVisitRow].getElementsByTagName("td")
            [roomToVisitCol].getElementsByTagName("img")[0].style.border =
            "1px solid rgb(255, 255, 255)";
          alreadyVistedRooms.push(this.board[roomToVisitRow][roomToVisitCol]);

          this.traverseBoard(targetRoom, 1, alreadyVistedRooms);
        }
      }
    }
    if (alreadyVistedRooms.length == 0) {
      console.log("we dont have place to go");
      this.changePlayerTurn();
    }
  };
  boardToHTML = () => {
    let finalResult = "";
    for (let i = 0; i < 7; i++) {
      let tempRow = "";
      for (let j = 0; j < 7; j++) {
        tempRow += this.board[i][j].getRoomHTMLRep();
      }
      if (i % 2 == 1) {
        finalResult += `<tr>
        <th class="left-arrow"><button>🢂</button></th>
        ${tempRow}
        <th class="right-arrow"><button>🢀</button></th>
        </tr>`;
      } else {
        finalResult += `<tr>
        ${tempRow}
        </tr>`;
      }
    }
    this.tableBoardDom.innerHTML = `
    <tbody class="top-arrows">
      <tr class="top-arrow"><td><button>🡻</button></td></tr>
      <tr class="top-arrow"><td><button>🡻</button></td></tr>
      <tr class="top-arrow"><td><button>🡻</button></td></tr>
    </tbody>
    ${finalResult}
    <tbody class="down-arrows">
    <tr class="down-arrow"><td><button>🡹</button></td></tr>
    <tr class="down-arrow"><td><button>🡹</button></td></tr>
    <tr class="down-arrow"><td><button>🡹</button></td></tr>
    </tbody>
    
    `;
  };

  moveRooms = (arrowType, arrowIndex) => {
    if (arrowType == "right-arrow" || arrowType == "left-arrow") {
      let startingIndex = arrowType == "right-arrow" ? 6 : 0;
      let edgeRoomIndex = arrowType == "right-arrow" ? 0 : 6;
      let trIndex = arrowIndex * 2 + 1;
      let trs = this.tableBoardDom.getElementsByTagName("tr")[trIndex];
      let edgeRoomDom = trs.getElementsByTagName("td")[edgeRoomIndex];
      let edgeRoom = this.board[trIndex][edgeRoomIndex];
      let i = arrowType == "right-arrow" ? 1 : 5;
      let condition = arrowType == "right-arrow" ? i < 7 : i >= 0;
      if (edgeRoom.getRoomHasPlayer()) {
        let player = edgeRoomDom.getElementsByClassName("player")[0];
        this.extraRoomDom
          .getElementsByClassName("players")[0]
          .appendChild(player);
        this.extraRoom.setRoomHasPlayer(true);
        let playerId = player.id;
        this.players[+playerId - 1].setPlayerPosition([trIndex, startingIndex]);
        edgeRoom.setRoomHasPlayer(false);
      }
      for (i; condition; ) {
        let nextPosition = arrowType == "right-arrow" ? i - 1 : i + 1;
        if (this.board[trIndex][i].getRoomHasPlayer()) {
          let playerId = trs
            .getElementsByTagName("td")
            [i].getElementsByClassName("player")[0].id;
          this.players[+playerId - 1].setPlayerPosition([
            trIndex,
            nextPosition,
          ]);
          this.board[trIndex][i].setRoomHasPlayer(false);
          this.board[trIndex][nextPosition] = this.board[trIndex][i];
          this.board[trIndex][nextPosition].setRoomHasPlayer(true);
        } else {
          this.board[trIndex][nextPosition] = this.board[trIndex][i];
        }
        this.board[trIndex][nextPosition].setRoomPosition([
          trIndex,
          nextPosition,
        ]);
        trs.getElementsByTagName("td")[nextPosition].innerHTML =
          trs.getElementsByTagName("td")[i].innerHTML;

        arrowType == "right-arrow" ? i++ : i--;
        condition = arrowType == "right-arrow" ? i < 7 : i >= 0;
      }
      trs.getElementsByTagName("td")[startingIndex].innerHTML =
        this.extraRoomDom.innerHTML;

      this.board[trIndex][startingIndex] = this.extraRoom;
      this.board[trIndex][startingIndex].setRoomPosition([
        trIndex,
        startingIndex,
      ]);
      this.extraRoomDom.innerHTML = edgeRoom.getRoomHTMLRep();
      this.extraRoom = edgeRoom;
      this.extraRoom.setRoomPosition([]);
    }
    if (arrowType == "down-arrow" || arrowType == "top-arrow") {
      let startingIndex = arrowType == "down-arrow" ? 6 : 0;
      let edgeRoomIndex = arrowType == "down-arrow" ? 0 : 6;
      let trIndex = arrowIndex * 2 + 1;
      let trs = this.tableBoardDom.getElementsByTagName("tr");
      let edgeRoomDom = trs[edgeRoomIndex].getElementsByTagName("td")[trIndex];
      let edgeRoom = this.board[edgeRoomIndex][trIndex];
      let i = arrowType == "down-arrow" ? 1 : 5;
      let condition = arrowType == "down-arrow" ? i < 7 : i >= 0;
      if (edgeRoom.getRoomHasPlayer()) {
        let player = edgeRoomDom.getElementsByClassName("player")[0];
        this.extraRoomDom
          .getElementsByClassName("players")[0]
          .appendChild(player);
        this.extraRoom.setRoomHasPlayer(true);
        let playerId = player.id;
        this.players[+playerId - 1].setPlayerPosition([startingIndex, trIndex]);
        edgeRoom.setRoomHasPlayer(false);
      }
      for (i; condition; ) {
        let nextPosition = arrowType == "down-arrow" ? i - 1 : i + 1;
        if (this.board[i][trIndex].getRoomHasPlayer()) {
          let playerId = trs[i]
            .getElementsByTagName("td")
            [trIndex].getElementsByClassName("player")[0].id;
          this.players[+playerId - 1].setPlayerPosition([
            nextPosition,
            trIndex,
          ]);
          this.board[i][trIndex].setRoomHasPlayer(false);
          this.board[nextPosition][trIndex] = this.board[i][trIndex];
          this.board[nextPosition][trIndex].setRoomHasPlayer(true);
        } else {
          this.board[nextPosition][trIndex] = this.board[i][trIndex];
        }
        this.board[i][trIndex].setRoomPosition([nextPosition, trIndex]);
        trs[nextPosition].getElementsByTagName("td")[trIndex].innerHTML =
          trs[i].getElementsByTagName("td")[trIndex].innerHTML;

        arrowType == "down-arrow" ? i++ : i--;
        condition = arrowType == "down-arrow" ? i < 7 : i >= 0;
      }
      trs[startingIndex].getElementsByTagName("td")[trIndex].innerHTML =
        this.extraRoomDom.innerHTML;

      this.board[startingIndex][trIndex] = this.extraRoom;
      this.board[startingIndex][trIndex].setRoomPosition([
        startingIndex,
        trIndex,
      ]);
      this.extraRoomDom.innerHTML = edgeRoom.getRoomHTMLRep();
      this.extraRoom = edgeRoom;
      this.extraRoom.setRoomPosition([]);
    }
  };

  rotateArray = (arrayToRotate, rotationNum) => {
    for (let i = 0; i < rotationNum; i++) {
      arrayToRotate.unshift(arrayToRotate.pop());
    }
  };

  listenForExtraRoomClick = () => {
    this.extraRoomDom.addEventListener("click", () => {
      this.rotateExtraRoom();
    });
  };

  rotateExtraRoom = () => {
    let currentRoomDeg = this.extraRoom.getRoomRotationDeg();
    if (currentRoomDeg === 360) currentRoomDeg = 0;
    this.extraRoom.setRoomRotationDeg(currentRoomDeg + 90);
    this.extraRoomDom.innerHTML = this.extraRoom.getRoomHTMLRep();
  };

  changePlayerTurn = () => {
    this.currentPlayerTurn++;
    if (this.currentPlayerTurn > this.playersNum) {
      this.currentPlayerTurn = 1;
    }
    gameInfo(this.players[this.currentPlayerTurn - 1]);
    localStorage.setItem("boardInLocalStorage", JSON.stringify(this));
    // console.log(JSON.parse(localStorage.getItem("boardInLocalStorage")));
    this.freezeUnFreezeArrowButtons();
  };
  removeHighlight = () => {
    let tds = this.tableBoardDom.getElementsByTagName("td");
    [...tds].forEach((td) => {
      if (td.getElementsByTagName("img")[0].style.border != "") {
        td.getElementsByTagName("img")[0].style.border = "";
      }
    });
  };
  gameOver = (winner) => {
    alert(`player ${winner.getPlayerNumber()} won the game!!`);
    let currentGame = document.querySelector(".game");
    let start = document.getElementById("start");
    start.style.display = "block";
    currentGame.style.display = "none";
  };

  refreshExtraRoom = () => {
    console.log(this.extraRoomDom);
  };

  shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  };
}
