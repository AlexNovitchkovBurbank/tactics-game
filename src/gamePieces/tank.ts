import features from "../features";
import type { GamePiece } from "../gamePieces/GamePiece";

class Tank implements GamePiece {
  name: string;
  power: number;
  numMovement: number;
  movementLeft: number;
  row: number;
  col: number;

  constructor(name: string, row: number, col: number) {
    this.name = "Tank-" + name;
    this.power = 2;
    this.numMovement = 2;
    this.movementLeft = 2;
    this.row = row;
    this.col = col;
  }

  getPosition(): { row: number; col: number } {
    return { row: this.row, col: this.col };
  }

  public move(row: number, col: number, feature: string): void {
    this.row = row;
    this.col = col;

    if (feature === features.Water || feature === features.Forest) {
      this.movementLeft = this.movementLeft - 2;
    } else if (feature === features.City) {
      this.movementLeft = this.movementLeft - 1 / 3;
    } else {
      this.movementLeft = this.movementLeft - 1;
    }
  }

  attack(): number {
    return this.power;
  }

  getPower(): number {
    return this.power;
  }

  /**
   * Gets the numMovement of the piece.
   * @returns numMovement of this piece
   */
  getNumMovement(): number {
    return this.numMovement;
  }

  /**
   * Gets the amount of numMovement left of the piece.
   */
  getMovementLeft(): number {
    return this.movementLeft;
  }
}

export default Tank;
