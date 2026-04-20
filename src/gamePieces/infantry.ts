import features from "../features";
import type { GamePiece } from "../gamePieces/GamePiece";

class Infantry implements GamePiece {
  name: string;
  power: number;
  numMovement: number;
  movementLeft: number;
  row: number;
  col: number;

  constructor(player: string, division: number, row: number, col: number) {
    this.name = "I" + "-" + player + division;
    this.power = 1;
    this.numMovement = 1;
    this.movementLeft = 1;
    this.row = row;
    this.col = col;
  }

  getName(): string {
    return this.name;
  }

  getPosition(): {row: number; col: number} {
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

  getNumMovement(): number {
    return this.numMovement;
  }

  getMovementLeft(): number {
    return this.movementLeft;
  }
}

export default Infantry;
