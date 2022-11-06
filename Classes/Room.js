export default class Room {
  constructor(roomType, rotationDeg, roomPosition = null, hasPlayer = false) {
    this.bend = [0, 1, 1, 0];
    this.Tpiece = [0, 1, 1, 1];
    this.Stright = [1, 0, 1, 0];
    this.roomType = roomType;
    this.rotationDeg = rotationDeg;
    this.roomPosition = roomPosition;
    this.roomRep = `../Images/${this.roomType}.jpeg`;
    this.hasPlayer = hasPlayer;
  }

  getRoomHTMLRep = () => {
    let treasure = this.isTreasure
      ? `<div class="card">${this.treasure}</div>`
      : "";

    return `<td>
    <img src="${this.roomRep}" style="transform:rotate(${this.rotationDeg}deg)">
    <div class="players"></div>
    ${treasure}
    </td>`;
  };
  getRoomPosition = () => this.roomPosition;
  getAvailability = () => {
    return this.roomType == "B"
      ? this.bend
      : this.roomType == "T"
      ? this.Tpiece
      : this.Stright;
  };

  getRoomType = () => this.roomType;
  getRoomRotationDeg = () => this.rotationDeg;
  setRoomRotationDeg = (newRotationDeg) => (this.rotationDeg = newRotationDeg);
  getRoomHasPlayer = () => this.hasPlayer;
  setRoomHasPlayer = (hasPlayer) => (this.hasPlayer = hasPlayer);
  setRoomPosition = (position) => (this.roomPosition = position);
  setTreasure = (treasure) => {
    this.isTreasure = true;
    this.treasure = treasure;
  };
  getIsTreasure = () => this.isTreasure;
  getTreasure = () => this.treasure;
}
