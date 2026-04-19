export interface GamePiece {
  getPosition(): { row: number; col: number };
  move(row: number, col: number, featureType: string): void;
  attack(): number;
  getPower(): number;
  getNumMovement(): number;
  getMovementLeft(): number;
}
