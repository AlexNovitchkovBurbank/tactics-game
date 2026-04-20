export interface GamePiece {
  getPosition(): { row: number; col: number };
  move(row: number, col: number, featureType: string): void;
  attack(): number;
  getPower(): number;
  getName(): string;
  getNumMovement(): number;
  getMovementLeft(): number;
}
