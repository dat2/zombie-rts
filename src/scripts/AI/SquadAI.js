import Unit from '../Units/Unit';

export class SquadMovementAI {

  constructor(squad) {
    this.squad = squad;
  }

  findPathsTo(map, worldPos, addToQueue) {
    let { x, y } = map.worldCoordsToTileCoords(worldPos);

    let squareSize = Math.ceil(Math.sqrt(this.squad.units.length));

    let posRow = 0;
    let posCol = 0;
    // first generate all the possible positions near the actually clicked position
    for(var unit of this.squad.units) {
      unit.MoveAI.findPathTo(map, map.tileCoordsToWorldCoords({ x: x + posRow, y: y + posCol }), addToQueue);

      posRow = (++posRow) % squareSize;
      posCol = posRow === 0 ? posCol + 1 : posCol;
    }
  }
}