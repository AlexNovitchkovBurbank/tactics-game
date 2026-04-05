import type { Feature } from "../features";
import type { GamePiece } from "../gamePieces/GamePiece";

class Infantry implements GamePiece {
  name: string;
  power: number;
  speed: number;
  row: number;
  col: number;

  constructor(name: string, row: number, col: number) {
    this.name = "Infantry-" + name;
    this.power = 1;
    this.speed = 1;
    this.row = row;
    this.col = col;
  }

  getPosition(): {row: number; col: number} {
    return { row: this.row, col: this.col };
  }

  public canMoveToSquare(occupied: boolean, currentSquareFeature: Feature): boolean {
    if (occupied) {
      return false;
    }
    
    if (currentSquareFeature === "River" || currentSquareFeature === "Mountain" || currentSquareFeature === "Forest") {
      return this.speed < 2 ? false : true;
    } else if (currentSquareFeature === "City") {
        return this.speed < (1 / 3) ? false : true;
    }

    return true;
  }

  public move(row: number, col: number, feature: Feature): void {
    this.row = row;
    this.col = col;
  }

  attack(): number {
    return this.power;
  }

  getPower(): number {
    return this.power;
  }

  getSpeed(): number {
    return this.speed;
  }
}

export default Infantry;
