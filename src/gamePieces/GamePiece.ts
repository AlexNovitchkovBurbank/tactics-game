import type { Feature } from "../features";

export interface GamePiece {
  getPosition(): { row: number; col: number };
  move(row: number, col: number, feature: Feature): string;
  attack(): number;
  getPower(): number;
  getSpeed(): number;
}
