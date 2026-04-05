import type { Feature } from "../features";

export interface GamePiece {
  getPosition(): { row: number; col: number };
  canMoveToSquare(occupied: boolean, currentSquareFeature: Feature): boolean;
  move(row: number, col: number, featureType: String): void;
  attack(): number;
  getPower(): number;
  getSpeed(): number;
}
