import type { Feature } from "../features";

export interface GamePiece {
  move(row: number, col: number, feature: Feature): string;
  attack(): number;
}
