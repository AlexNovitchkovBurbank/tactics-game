import type { Feature } from "../features"
import type { GamePiece } from "../gamePieces/GamePiece"

class Tank implements GamePiece {
    name: string
    power: number
    speed: number
    row: number
    col: number

    constructor(name: string, row: number, col: number) {
        this.name = "Tank-" + name;
        this.power = 2
        this.speed = 2
        this.row = row
        this.col = col
    }

    public move(row: number, col: number, feature: Feature): string {
        if (this.row === row && this.col === col) {
            return this.name;
        }

        return "";
    }

    attack(): number {
        return this.power;
    }
}

export default Tank