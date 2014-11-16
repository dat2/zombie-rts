import Unit from 'Units/Unit';

export class SquadMovementAI {

  constructor(squad) {
    this.squad = squad;
  }

  moveTo(map, worldPos, addToQueue) {
    let { x, y } = map.worldCoordsToTileCoords(worldPos);

    let squareSize = Math.ceil(Math.sqrt(this.squad.units.length));
    let initPos = Math.floor(squareSize / 2);

    let posRow = -initPos;
    let posCol = -initPos;
    // first generate all the possible positions near the actually clicked position
    for(var unit of this.squad.units) {
      unit.MoveAI.moveTo(map, map.tileCoordsToWorldCoords({ x: x + posRow, y: y + posCol }), addToQueue);

      posRow = (++posRow) % squareSize;
      posCol = posRow === 0 ? posCol + 1 : posCol;
    }
  }
}